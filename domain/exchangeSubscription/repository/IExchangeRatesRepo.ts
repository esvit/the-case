export interface IExchangeRatesRepo {
  getExchangeRate(baseCurrencyCode: string, quoteCurrencyCode: string, date: Date): Promise<number|null>;
  saveExchangeRate(baseCurrencyCode: string, quoteCurrencyCode: string, date: Date, rate: number): Promise<void>;
}
