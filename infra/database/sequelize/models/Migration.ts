import { Model, DataTypes, InferAttributes, InferCreationAttributes } from '@sequelize/core';
import db from '../helpers/db';

export
class Migration extends Model<InferAttributes<Migration>, InferCreationAttributes<Migration>> {
  name: String;
  appliedAt: Date;
}

const model = Migration.init({
  name: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  appliedAt: { type: DataTypes.DATE }
}, {
  sequelize: db,
  tableName: '_migrations'
});

export default model;
