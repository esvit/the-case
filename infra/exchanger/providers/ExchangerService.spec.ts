import axios from 'axios';
import ExchangerService from "./ExchangerService";

jest.mock('axios', () => ({
  get: jest.fn()
}));

describe('ExchangerService', () => {
  let service: ExchangerService;
  beforeEach(() => {
    service = new ExchangerService();
  });
  test('getNbuRate', async () => {
    (axios.get as jest.Mock).mockImplementation(() => Promise.resolve({ data: [{ cc: 'USD', rate: 27.5 }] }));
    expect(await service.getNbuRate('USD', new Date())).toBe(27.5);
  });
  test('getBinanceRate', async () => {
    (axios.get as jest.Mock).mockImplementation(() => Promise.resolve({ data: [[0, 0, 0, 0, '27.5', 0, 0, 0, 0, 0, 0]] }));
    expect(await service.getBinanceRate('USD', new Date())).toBe(27.5);
  });
});
