import Router, { RouterContext } from '@koa/router';

interface ILoggerFunc {
  (msg: string, ...args: any[]): void;
}

export interface ILogger {
  fatal: ILoggerFunc;
  error: ILoggerFunc;
  warn: ILoggerFunc;
  info: ILoggerFunc;
  debug: ILoggerFunc;
  log: ILoggerFunc;
  silent: ILoggerFunc;
  captureException: (arg0: Error, arg1: any, user: any) => void;
}

export interface IDatabase {
  runMigrations(path?:string): Promise<void>;
  revertMigration(name:string, path?:string): Promise<void>;
  connect(): Promise<void>;
  close(): Promise<void>;
  isConnected(): boolean;
  inTransaction(func: (transaction:any) => Promise<void>): Promise<void>;
}

export interface IMailer {
  sendNotification(email: string, subject: string, message: string): Promise<void>
}

export type TemplateResponse = { subject: string, message: string };
export interface ITemplateEngine {
  getMessage(params: Record<string, any>): Promise<TemplateResponse>;
}

export interface IServer {
  start(): void
}

export interface IExchangeRateService {
  loop(): Promise<void>;
  getBitcoinRate(date: Date): Promise<number|null>;
  notifySubscribers(): Promise<void>;
}

export interface HTTPRouter {
  getRouter(): Router;
}

export type RouterContextBody = RouterContext & {
  query: any;
  request: { body: any; };
};

export enum RateSources {
  Binance = 'Binance',
  Nbu = 'Nbu',
}

export interface IExchangerService {
  getExchangeRate(source: RateSources, date: Date, currencyCode: string): Promise<number|null>;
}
