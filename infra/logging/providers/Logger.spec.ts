import Logger from './Logger';

const env:Record<string, any> = {
};
jest.mock('../../env', () => (name:string) => env[name]);

describe('Logger', () => {
  let logger:Logger;
  beforeEach(() => {
    logger = new Logger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('logs debug messages', () => {
    const mock = jest.spyOn(console, 'debug');
    logger.debug('debug message');
    expect(mock).toHaveBeenCalledWith('debug message');
    mock.mockRestore();
  });

  it('logs info messages', () => {
    const mock = jest.spyOn(console, 'info');
    logger.info('info message');
    expect(mock).toHaveBeenCalledWith('info message');
    mock.mockRestore();
  });

  it('logs error messages', () => {
    const mock = jest.spyOn(console, 'error');
    logger.error('error message');
    expect(mock).toHaveBeenCalledWith('error message');
    mock.mockRestore();
  });

  it('logs fatal messages', () => {
    const mock = jest.spyOn(console, 'error');
    logger.fatal('fatal message');
    expect(mock).toHaveBeenCalledWith('fatal message');
    mock.mockRestore();
  });

  it('logs silent messages', () => {
    const mock = jest.spyOn(console, 'debug');
    logger.silent('silent message');
    expect(mock).toHaveBeenCalledWith('silent message');
    mock.mockRestore();
  });

  it('logs warn messages', () => {
    const mock = jest.spyOn(console, 'warn');
    logger.warn('warn message');
    expect(mock).toHaveBeenCalledWith('warn message');
    mock.mockRestore();
  });

  it('logs debug messages with additional arguments', () => {
    const mock = jest.spyOn(console, 'debug');
    logger.debug('debug message', { arg1: 'value1' }, { arg2: 'value2' });
    expect(mock).toHaveBeenCalledWith({ arg1: 'value1', arg2: 'value2' }, 'debug message');
    mock.mockRestore();
  });

  it('logs info messages with additional arguments', () => {
    const mock = jest.spyOn(console, 'info');
    logger.info('info message', { arg1: 'value1' }, { arg2: 'value2' });
    expect(mock).toHaveBeenCalledWith({ arg1: 'value1', arg2: 'value2' }, 'info message');
    mock.mockRestore();
  });

  it('logs error messages with additional arguments', () => {
    const mock = jest.spyOn(console, 'error');
    logger.error('error message', { arg1: 'value1' }, { arg2: 'value2' });
    expect(mock).toHaveBeenCalledWith({ arg1: 'value1', arg2: 'value2' }, 'error message');
    mock.mockRestore();
  });

  it('logs fatal messages with additional arguments', () => {
    const mock = jest.spyOn(console, 'error');
    logger.fatal('fatal message', { arg1: 'value1' }, { arg2: 'value2' });
    expect(mock).toHaveBeenCalledWith({ arg1: 'value1', arg2: 'value2' }, 'fatal message');
    mock.mockRestore();
  });

  it('logs silent messages with additional arguments', () => {
    const mock = jest.spyOn(console, 'debug');
    logger.silent('silent message', { arg1: 'value1' }, { arg2: 'value2' });
    expect(mock).toHaveBeenCalledWith({ arg1: 'value1', arg2: 'value2' }, 'silent message');
    mock.mockRestore();
  });

  it('logs warn messages with additional arguments', () => {
    const mock = jest.spyOn(console, 'warn');
    logger.warn('warn message', { arg1: 'value1' }, { arg2: 'value2' });
    expect(mock).toHaveBeenCalledWith({ arg1: 'value1', arg2: 'value2' }, 'warn message');
    mock.mockRestore();
  });
});
