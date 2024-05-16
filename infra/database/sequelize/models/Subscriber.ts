import {Model, DataTypes, InferAttributes, InferCreationAttributes} from '@sequelize/core';
import db from '../helpers/db';

export
class Subscriber extends Model<InferAttributes<Subscriber>, InferCreationAttributes<Subscriber>> {
  email: string;
  createdAt?: Date;
}

const model = Subscriber.init({
  email: { type: DataTypes.STRING(200), allowNull: false, primaryKey: true },
  createdAt: { type: DataTypes.DATE, allowNull: true }
}, {
  sequelize: db,
  tableName: 'subscribers'
});

export default model;
