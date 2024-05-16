import {ExchangeRate} from "../models/ExchangeRate";
import ExchangeRatesRepo from "./ExchangeRatesRepo";

describe('ExchangeRatesRepo', () => {
  let repo: ExchangeRatesRepo;
  beforeEach(() => {
    repo = new ExchangeRatesRepo();
  });
  test('getExchangeRate', async () => {
    jest.spyOn(ExchangeRate, 'findOne').mockResolvedValue(<any>{ rate: 1.2 });
    expect(await repo.getExchangeRate('USD', 'UAH', new Date())).toEqual(1.2);
  })
  test('saveExchangeRate', async () => {
    const mock = jest.spyOn(ExchangeRate, 'upsert').mockImplementation(<any>(() => {}));
    await repo.saveExchangeRate('USD', 'UAH', new Date(), 1.2);
    expect(mock).toHaveBeenCalledWith({
      "baseCurrency": "USD",
      "date": "2024-05-16",
      "quoteCurrency": "UAH",
      "rate": 1.2,
    });
  })
});
