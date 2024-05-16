import {Model, DataTypes, InferAttributes, InferCreationAttributes} from '@sequelize/core';
import db from '../helpers/db';

export
class ExchangeRate extends Model<InferAttributes<ExchangeRate>, InferCreationAttributes<ExchangeRate>> {
  date: string;
  baseCurrency: string;
  quoteCurrency: string;
  rate: number;
  createdAt?: Date;
}

const model = ExchangeRate.init({
  date: { type: DataTypes.DATEONLY, allowNull: false, primaryKey: true },
  baseCurrency: { type: DataTypes.STRING(3), allowNull: false, primaryKey: true },
  quoteCurrency: { type: DataTypes.STRING(3), allowNull: false, primaryKey: true },
  rate: { type: DataTypes.DOUBLE, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: true }
}, {
  sequelize: db,
  tableName: 'exchangeRates'
});

export default model;
