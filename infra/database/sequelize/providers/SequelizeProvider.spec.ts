import SequelizeProvider from "./SequelizeProvider";
import db from "../helpers/db";

jest.mock('../helpers/db', () => {
  const db = jest.requireActual('../helpers/db');
  db.default.transaction = jest.fn();
  db.default.authenticate = jest.fn();
  db.default.close = jest.fn();
  return db;
});

describe('SequelizeProvider', () => {
  let repo:SequelizeProvider;
  const Logger:any = {
    log: jest.fn(),
    debug: jest.fn(),
  };
  beforeEach(() => {
    repo = new SequelizeProvider({ Logger });
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('inTransaction', async () => {
    const tr = {
      commit: jest.fn(),
      rollback: jest.fn(),
    };
    (db.transaction as jest.Mock).mockImplementation((func) => func(tr));
    const mock = jest.fn().mockResolvedValueOnce('test');
    await repo.inTransaction(mock);
    expect(mock).toHaveBeenCalledWith(tr);

    const mock2 = jest.fn().mockImplementation(() => { throw new Error('test'); });
    await expect(repo.inTransaction(mock2)).rejects.toThrow('test');
    expect(mock2).toHaveBeenCalledWith(tr);
  });

  test('connect', async () => {
    const prev = Date.prototype.getTimezoneOffset;
    Date.prototype.getTimezoneOffset = jest.fn(() => 100);

    await expect(repo.connect()).rejects.toThrow('Please set your timezone to UTC (env TZ=UTC)');

    Date.prototype.getTimezoneOffset = jest.fn(() => 0);
    expect(repo.isConnected()).toBeFalsy();

    await repo.connect();

    Date.prototype.getTimezoneOffset = prev;

    expect(db.authenticate).toHaveBeenCalled();
    expect(repo.isConnected()).toBeTruthy();

    // (<any>db.options.logging)('test', { tableNames: ['test'] });

    // expect(Logger.log).toHaveBeenCalledWith("test", {"scope": "sequelize", "tableNames": "test"});

    await db.close();

    expect(db.close).toHaveBeenCalled();
  });
});
