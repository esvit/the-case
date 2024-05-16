import path from 'path';
import sequelize, { sql, DataTypes, Transaction} from "@sequelize/core";
import db from "../helpers/db";
import {IDatabase, ILogger} from '../../../../types';
import {Migration} from '../models/Migration';
import fs from "fs";

export default
class SequelizeProvider implements IDatabase {
  protected _isConnected: boolean = false;
  protected _logger: ILogger;

  constructor({ Logger }: { Logger:ILogger }) {
    this._logger = Logger;
  }

  async inTransaction(func: (t: Transaction) => Promise<void>): Promise<void> {
    return db.transaction(func);
  }

  async connect():Promise<void> {
    if ((new Date()).getTimezoneOffset() !== 0) {
      throw new Error('Please set your timezone to UTC (env TZ=UTC)');
    }
    await db.authenticate();
    this._isConnected = true;
  }

  isConnected():boolean {
    return this._isConnected;
  }

  close(): Promise<void> {
    return db.close();
  }
  async runMigrations(migrationDir?:string) {
    const migrationsPath = migrationDir || `${__dirname}/../migrations`;
    db.queryInterface.createTable('_migrations', {
      name: DataTypes.STRING,
      appliedAt: {
        type: DataTypes.DATE,
        defaultValue: sql`current_timestamp`,
        allowNull: false
      }
    });
    this._logger.debug(`Scan folder "${migrationsPath}" for migrations`, { scope: 'migrations' });
    const list = await fs.promises.readdir(migrationsPath);
    const migrations = await Migration.findAll({});
    for (const file of list) {
      if (!/\.[j|t]s$/.exec(file)) {
        // eslint-disable-next-line no-continue
        continue;
      }
      const appliedMigration = migrations.find((migration) => migration.name === file);
      if (appliedMigration) {
        this._logger.debug(`Migration "${file}" already applied at ${appliedMigration.appliedAt}`, { scope: 'migrations' });
        // eslint-disable-next-line no-continue
        continue;
      }
      this._logger.debug(`Migration "${file}" applying...`, { scope: 'migrations' });
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { up } = require(path.join(migrationsPath, file));
      if (!up) {
        throw new Error(`Invalid migration functions in file ${file}`);
      }
      try {
        // eslint-disable-next-line no-await-in-loop
        await up(db.queryInterface, sequelize);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        throw err;
      }
      const item = new Migration({
        name: file.replace(/.ts$/, '.js'),
        appliedAt: new Date()
      });
      // eslint-disable-next-line no-await-in-loop
      await item.save();
    }
  }

  async revertMigration(name:String, migrationFile?:string) {
    if (!migrationFile) {
      throw new Error('Migration file not provided');
    }
    const migrationsPath = migrationFile || `${__dirname}/../migrations/${migrationFile}`;
    this._logger.debug(`Reverting "${migrationsPath}"...`, { scope: 'migrations' });
    const migration = await Migration.findOne({ where: { name } });
    if (!migration) {
      throw new Error(`Migration "${name}" not applied`);
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { down } = require(migrationFile);
    if (!down) {
      throw new Error(`Invalid migration functions in file ${migrationFile}`);
    }
    // eslint-disable-next-line no-await-in-loop
    await down(db.queryInterface, sequelize);
    await migration.destroy();
  }
}
