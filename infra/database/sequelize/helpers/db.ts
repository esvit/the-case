import Sequelize from '@sequelize/core';
import { MariaDbDialect } from '@sequelize/mariadb';
import env, {isTestEnv} from '../../../env';

// eslint-disable-next-line no-console
let logging = env('DB_LOG') ? console.log : false;
const testEnvQueries:string[] = [];
if (isTestEnv) {
  // eslint-disable-next-line no-console
  logging = (plain, {transaction}) => {
    const query = plain.replace(`Executing (${transaction ? transaction.id : 'default'}): `, '');
    testEnvQueries.push(query);
    // eslint-disable-next-line no-console
    console.error(query);
    // eslint-disable-next-line no-console
    console.trace();
    throw new Error(`Found query to database, you should mock it: ${query}`);
  };
}

const db = new Sequelize({
  dialect: MariaDbDialect,
  logging,
  define: {
    freezeTableName: true,
    timestamps: false
  },
  pool: {
    min: 0,
    max: 20,
    idle: 10000,
    acquire: 60000
  },
  port: Number(env('DB_PORT')),
  host: env('DB_HOSTNAME'),
  user: env('DB_USERNAME'),
  password: env('DB_PASSWORD').toString(),
  database: env('DB_DATABASE'),
  timezone: '+00:00',
});
export default db;
