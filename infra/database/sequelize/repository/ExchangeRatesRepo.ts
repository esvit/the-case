import {IExchangeRatesRepo} from "../../../../domain/exchangeSubscription/repository/IExchangeRatesRepo";
import {ExchangeRate} from "../models/ExchangeRate";

export default
class ExchangeRatesRepo implements IExchangeRatesRepo {
  async getExchangeRate(baseCurrencyCode: string, quoteCurrencyCode: string, date: Date): Promise<number|null> {
    const exchangeRate = await ExchangeRate.findOne({
      where: {
        date: date.toISOString().split('T')[0],
        baseCurrency: baseCurrencyCode,
        quoteCurrency: quoteCurrencyCode
      }
    });
    return exchangeRate ? exchangeRate.rate : null;
  }

  async saveExchangeRate(baseCurrencyCode: string, quoteCurrencyCode: string, date: Date, rate: number): Promise<void> {
    await ExchangeRate.upsert({
      date: date.toISOString().split('T')[0],
      baseCurrency: baseCurrencyCode,
      quoteCurrency: quoteCurrencyCode,
      rate: rate
    });
  }
}
