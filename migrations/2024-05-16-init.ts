import { AbstractQueryInterface } from "@sequelize/core";

export
async function up(queryInterface:AbstractQueryInterface, { DataTypes, literal }:any) {
  await queryInterface.createTable('exchangeRates', {
    date: { type: DataTypes.DATEONLY, allowNull: false, primaryKey: true },
    baseCurrency: { type: DataTypes.STRING(3), allowNull: false, primaryKey: true },
    quoteCurrency: { type: DataTypes.STRING(3), allowNull: false, primaryKey: true },
    rate: { type: DataTypes.DOUBLE, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: literal('CURRENT_TIMESTAMP'), allowNull: false }
  });
  await queryInterface.createTable('subscribers', {
    email: { type: DataTypes.STRING(200), allowNull: false, primaryKey: true },
    createdAt: { type: DataTypes.DATE, defaultValue: literal('CURRENT_TIMESTAMP'), allowNull: false }
  });
}
