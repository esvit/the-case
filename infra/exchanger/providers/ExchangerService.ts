import axios from "axios";
import {IExchangerService, RateSources} from "../../../types";
import {pad} from "../../../helpers/math";

export default
class ExchangerService implements IExchangerService {
  async getExchangeRate(source: RateSources, date: Date, currencyCode: string): Promise<number|null> {
    switch (source) {
      case RateSources.Nbu:
        return this.getNbuRate(currencyCode, date);
      case RateSources.Binance:
        return this.getBinanceRate(currencyCode, date);
    }
  }

  async getNbuRate(currencyCode: string, date: Date): Promise<number|null> {
    const {data} = await axios.get(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json&date=${date.getFullYear() + pad(date.getMonth(), 2) + pad(date.getDate(), 2)}`);
    const rate = data.find((item: any) => item.cc === currencyCode);
    return rate ? rate.rate : null;
  }

  async getBinanceRate(currencyCode: string, date: Date): Promise<number|null> {
    const todayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const url = `https://api.binance.com/api/v3/klines?symbol=${currencyCode}USDT&interval=1d&limit=1&startTime=${todayStart.getTime()}`;
    const {data} = await axios.get(url);
    if (!data.length) {
      return null;
    }
    const [
      ,        // Kline open time
      ,       // Open price
      ,       // High price
      ,       // Low price
      closePrice,     // Close price
      ,         // Volume
      ,      // Kline Close time
      ,    // Quote asset volume
      ,                // Number of trades
      ,    // Taker buy base asset volume
      ,      // Taker buy quote asset volume
    ] = data[0];
    return parseFloat(closePrice);
  }
}
