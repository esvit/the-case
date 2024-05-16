import Router from '@koa/router';
import {HTTPRouter} from '../../types';

export default
class RootRouter implements HTTPRouter {
  protected _routers: HTTPRouter[];

  constructor({ RateRouter, SubscriptionRouter } : { RateRouter: HTTPRouter, SubscriptionRouter: HTTPRouter }) {
    this._routers = [RateRouter, SubscriptionRouter];
  }

  getRouter(): Router {
    const route = new Router();
    route.prefix('/api')
    for (const router of this._routers) {
      route.use(router.getRouter().routes());
    }

    return new Router()
      .get('/robots.txt', (ctx) => { ctx.body = 'User-Agent: *\nDisallow: /' })
      .get('/health', (ctx) => { ctx.body = 'OK' })
      .use(route.routes())
    ;
  }
}
