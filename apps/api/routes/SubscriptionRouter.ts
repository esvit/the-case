import Router from '@koa/router'
import {HTTPRouter, IExchangeRateService, RouterContextBody} from '../../../types';
import {ISubscriptionRepo} from "../../../domain/exchangeSubscription/repository/ISubscriptionRepo";
import {Email} from "../../../domain/exchangeSubscription/valueObject/Email";

export default
class SubscriptionRouter implements HTTPRouter {
  protected _subscriptionRepo: ISubscriptionRepo;
  protected _exchangeRateService: IExchangeRateService;

  constructor({ SubscriptionRepo, ExchangeRateService }: { SubscriptionRepo: ISubscriptionRepo, ExchangeRateService: IExchangeRateService }) {
    this._subscriptionRepo = SubscriptionRepo;
    this._exchangeRateService = ExchangeRateService;
  }

  getRouter(): Router {
    return new Router()
      .post('/subscribe', this.subscribe.bind(this))
      .post('/sendEmails', this.sendEmails.bind(this))
    ;
  }

  async subscribe(ctx: RouterContextBody) {
    try {
      const res = await this._subscriptionRepo.subscribe(Email.create(ctx.request.body.email));
      if (!res) {
        return ctx.send(409, {success: false, message: 'Already subscribed'});
      }
      ctx.ok({success: true});
    } catch (e:any) {
      ctx.send(400, { success: false, message: e.message });
    }
  }

  async sendEmails(ctx: RouterContextBody) {
    await this._exchangeRateService.notifySubscribers();
    ctx.ok({ success: true });
  }
}
