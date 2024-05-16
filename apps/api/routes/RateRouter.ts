import Router from '@koa/router'
import {HTTPRouter, IExchangeRateService, RouterContextBody} from '../../../types';

export default
class RateRouter implements HTTPRouter {
  protected _exchangeRateService: IExchangeRateService;

  constructor({ ExchangeRateService }: { ExchangeRateService: IExchangeRateService }) {
    this._exchangeRateService = ExchangeRateService;
  }

  getRouter(): Router {
    return new Router()
      .get('/rate', this.getRate.bind(this))
    ;
  }

  async getRate(ctx: RouterContextBody) {
    const rate = await this._exchangeRateService.getBitcoinRate(new Date());
    if (!rate) {
      return ctx.send(400, { success: false, message: 'No exchange rate' });
    }
    ctx.ok(rate);
  }
}
