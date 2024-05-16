import { ILogger } from '../../../types';

export default class Logger implements ILogger {
  protected _logger: any;

  constructor() {
    this._logger = console;
  }

  debug(msg: string, ...args: any[]) {
    if (args.length > 0) {
      this._logger.debug(args.reduce((acc, arg) => Object.assign(acc, arg), {}), msg,);
    } else {
      this._logger.debug(msg);
    }
  }
  log(msg: string, ...args: any[]) {
    if (args.length > 0) {
      this._logger.info(args.reduce((acc, arg) => Object.assign(acc, arg), {}), msg,);
    } else {
      this._logger.info(msg);
    }
  }
  info(msg: string, ...args: any[]) {
    if (args.length > 0) {
      this._logger.info(args.reduce((acc, arg) => Object.assign(acc, arg), {}), msg,);
    } else {
      this._logger.info(msg);
    }
  }
  error(msg: string, ...args: any[]) {
    if (args.length > 0) {
      this._logger.error(args.reduce((acc, arg) => Object.assign(acc, arg), {}), msg,);
    } else {
      this._logger.error(msg);
    }
  }
  fatal(msg: string, ...args: any[]) {
    if (args.length > 0) {
      this._logger.error(args.reduce((acc, arg) => Object.assign(acc, arg), {}), msg,);
    } else {
      this._logger.error(msg);
    }
  }
  silent(msg: string, ...args: any[]) {
    if (args.length > 0) {
      this._logger.debug(args.reduce((acc, arg) => Object.assign(acc, arg), {}), msg,);
    } else {
      this._logger.debug(msg);
    }
  }
  warn(msg: string, ...args: any[]) {
    if (args.length > 0) {
      this._logger.warn(args.reduce((acc, arg) => Object.assign(acc, arg), {}), msg,);
    } else {
      this._logger.warn(msg);
    }
  }

  captureException(err: Error, payload: any) {
    console.info('Put into Sentry', err, payload);
  }
}
