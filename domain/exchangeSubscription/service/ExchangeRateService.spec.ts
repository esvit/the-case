import cron from "node-cron";
import ExchangeRateService from "./ExchangeRateService";
import {IExchangerService, ILogger, IMailer, ITemplateEngine} from "../../../types";
import {IExchangeRatesRepo} from "../repository/IExchangeRatesRepo";
import {ISubscriptionRepo} from "../repository/ISubscriptionRepo";
import {Email} from "../valueObject/Email";

jest.mock('node-cron', () => ({schedule: jest.fn()}));

describe('ExchangeRateService', () => {
  let service: ExchangeRateService;
  const ExchangerService:IExchangerService = {
    getExchangeRate: jest.fn()
  };
  const ExchangeRatesRepo:IExchangeRatesRepo = {
    getExchangeRate: jest.fn(),
    saveExchangeRate: jest.fn()
  };
  const SubscriptionRepo:ISubscriptionRepo = {
    getSubscribers: jest.fn(),
    subscribe: jest.fn()
  };
  const TemplateService:ITemplateEngine = {
    getMessage: jest.fn()
  };
  const MailerService:IMailer = {
    sendNotification: jest.fn()
  };
  const Logger:ILogger = <any>console;

  beforeEach(() => {
    service = new ExchangeRateService({
      ExchangerService, ExchangeRatesRepo, SubscriptionRepo, TemplateService, MailerService, Logger
    });
  });
  test('getBitcoinRate', async () => {
    (ExchangeRatesRepo.getExchangeRate as jest.Mock).mockResolvedValueOnce(2);
    (ExchangeRatesRepo.getExchangeRate as jest.Mock).mockResolvedValueOnce(3);

    expect(await service.getBitcoinRate(new Date())).toEqual(6);

    (ExchangeRatesRepo.getExchangeRate as jest.Mock).mockResolvedValueOnce(null);
    (ExchangeRatesRepo.getExchangeRate as jest.Mock).mockResolvedValueOnce(3);

    expect(await service.getBitcoinRate(new Date())).toEqual(null);
  });
  test('loop', async () => {
    (cron.schedule as jest.Mock).mockImplementation((_: any, cb: any) => cb());

    jest.spyOn(service, 'loadExchangeRate').mockImplementation(async () => {});

    await service.loadExchangeRate();

    expect(service.loadExchangeRate).toHaveBeenCalled();
  });
  test('loadExchangeRate', async () => {
    (ExchangerService.getExchangeRate as jest.Mock).mockResolvedValueOnce(2);
    (ExchangerService.getExchangeRate as jest.Mock).mockResolvedValueOnce(3);

    await service.loadExchangeRate();

    expect(ExchangeRatesRepo.saveExchangeRate).toHaveBeenCalledWith('UAH', 'USD', expect.any(Date), 3);
    expect(ExchangeRatesRepo.saveExchangeRate).toHaveBeenCalledWith('USD', 'BTC', expect.any(Date), 2);
  });
  test('notifySubscribers', async () => {
    (SubscriptionRepo.getSubscribers as jest.Mock).mockImplementation(function *() {
      yield Email.create('test@mail.com');
    });
    jest.spyOn(service, 'getBitcoinRate').mockResolvedValue(6);
    (TemplateService.getMessage as jest.Mock).mockResolvedValueOnce({ subject: 'test', message: 'test' });

    await service.notifySubscribers();

    expect(MailerService.sendNotification).toHaveBeenCalledWith("test@mail.com", "test", "test");
  });
});
