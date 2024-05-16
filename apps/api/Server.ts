import {AwilixContainer} from "awilix";
import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
// @ts-ignore
import respond from 'koa-respond';
import helmet from 'koa-helmet';
import { isProdEnv } from '../../infra/env';
import {IDatabase, ILogger, IExchangeRateService, IServer} from '../../types';
import { errorMiddleware } from './middlewares/error';

export default
class Server implements IServer {
  _httpPort: number;
  _bodyLengthLimit: string;
  _logger: ILogger;
  _diContainer: AwilixContainer<any>;
  _sequelizeProvider: IDatabase;
  _exchangeRateService: IExchangeRateService;

  constructor({ SequelizeProvider, Logger, env, DIContainer, ExchangeRateService }: {
    SequelizeProvider: IDatabase, Logger: ILogger, env: any, DIContainer: AwilixContainer<any>, ExchangeRateService: IExchangeRateService
  }) {
    this._sequelizeProvider = SequelizeProvider;
    this._diContainer = DIContainer;
    this._httpPort = env('HTTP_PORT');
    this._bodyLengthLimit = env('BODY_LENGTH_LIMIT');
    this._logger = Logger;
    this._exchangeRateService = ExchangeRateService;
  }

  async start(): Promise<void> {
    if (!(new Date()).toString().includes('+0000')) {
      throw new Error('Please set your timezone to UTC (env TZ=UTC)');
    }
    await this._sequelizeProvider.connect();
    await this._sequelizeProvider.runMigrations(`${__dirname}/../../migrations`);

    const logger = this._logger;

    const app = new Koa();
    app.proxy = true;

    app
      .use(cors({
        credentials: true,
        origin: (ctx) => ctx.request.header.origin ?? 'none'
      }))
      .use(bodyParser({
        formLimit: this._bodyLengthLimit,
        jsonLimit: this._bodyLengthLimit
      }))
      .use(helmet({
        // щоб працював вхід через window.open (google auth)
        contentSecurityPolicy: false,
        crossOriginOpenerPolicy: false,
        crossOriginResourcePolicy: false // щоб вантажились іконки для marketplace
      }))
      .use(compress())
      .use(respond())
      .use(errorMiddleware({ Logger: this._logger }, isProdEnv))
      .use(async (ctx, next) => {
        this._logger.info(`🔗 ${ctx.request.method} ${ctx.originalUrl}`);
        ctx.state.scope = this._diContainer.createScope();
        return next();
      })
      .use((ctx, next) => {
        const rootRouter = ctx.state.scope.resolve('RootRouter');
        const router = rootRouter.getRouter();
        return router.routes()(ctx, next);
      })
    ;

    app.on('error', (err) => {
      if (process.env.NODE_ENV !== 'test') {
        logger.error(err);
      }
    });

    app.listen(this._httpPort);
    logger.info(`Listening on http://localhost:${this._httpPort}`);

    await this._exchangeRateService.loop();
  }
}
