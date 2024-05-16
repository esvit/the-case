import cron from 'node-cron';
import {IExchangerService, IExchangeRateService, RateSources, IMailer, ITemplateEngine, ILogger} from "../../../types";
import {IExchangeRatesRepo} from "../repository/IExchangeRatesRepo";
import {ISubscriptionRepo} from "../repository/ISubscriptionRepo";

export default
class ExchangeRateService implements IExchangeRateService {
  protected _exchangerService: IExchangerService;
  protected _subscriptionRepo: ISubscriptionRepo;
  protected _exchangeRatesRepo: IExchangeRatesRepo;
  protected _mailerService: IMailer;
  protected _templateEngine: ITemplateEngine;
  protected _logger: ILogger;

  constructor({
    ExchangerService, ExchangeRatesRepo, SubscriptionRepo, TemplateService, MailerService, Logger
  } : {
    ExchangerService : IExchangerService, ExchangeRatesRepo: IExchangeRatesRepo,
    SubscriptionRepo: ISubscriptionRepo, TemplateService: ITemplateEngine, MailerService: IMailer, Logger: ILogger
  }) {
    this._exchangerService = ExchangerService;
    this._exchangeRatesRepo = ExchangeRatesRepo;
    this._subscriptionRepo = SubscriptionRepo;
    this._templateEngine = TemplateService;
    this._mailerService = MailerService;
    this._logger = Logger;
  }

  async getBitcoinRate(date: Date): Promise<number|null> {
    const [binanceRate, nbuRate] = await Promise.all([
      this._exchangeRatesRepo.getExchangeRate('USD', 'BTC', date),
      this._exchangeRatesRepo.getExchangeRate('UAH', 'USD', date),
    ]);
    if (!binanceRate || !nbuRate) {
      return null;
    }
    return binanceRate * nbuRate;
  }

  async loop() {
    // should be on daily basis, but for the sake of testing it's every 5 seconds
    cron.schedule('*/5 * * * * *', this.loadExchangeRate.bind(this));

    // notify subscribers every day at 00:00
    cron.schedule('0 0 * * *', this.notifySubscribers.bind(this));
  }

  async loadExchangeRate() {
    const date = new Date();
    const [binanceRate, nbuRate] = await Promise.all([
      this._exchangerService.getExchangeRate(RateSources.Binance, date, 'BTC'),
      this._exchangerService.getExchangeRate(RateSources.Nbu, date, 'USD')
    ]);
    await Promise.all([
      binanceRate && this._exchangeRatesRepo.saveExchangeRate('USD', 'BTC', date, binanceRate),
      nbuRate && this._exchangeRatesRepo.saveExchangeRate('UAH', 'USD', date, nbuRate)
    ]);
  }

  async notifySubscribers() {
    const pager = this._subscriptionRepo.getSubscribers();
    const date = new Date();
    const rate = await this.getBitcoinRate(date);
    if (!rate) {
      return;
    }
    const template = await this._templateEngine.getMessage({ date, rate });
    for await (const email of pager) {
      try {
        await this._mailerService.sendNotification(email.toPrimitive(), template.subject, template.message);
      } catch (e:any) {
        this._logger.error(`Failed to send notification to ${email.toPrimitive()}: ${e.message}`);
      }
    }
  }
}
