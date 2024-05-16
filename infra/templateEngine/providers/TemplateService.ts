import {ITemplateEngine, TemplateResponse} from "../../../types";

export default
class TemplateService implements ITemplateEngine {
  async getMessage(params: Record<string, any>): Promise<TemplateResponse> {
    return {
      subject: 'Daily exchange rate',
      message: `Exchange rate for BTC/UAH: ${params.rate}`
    };
  }
}
