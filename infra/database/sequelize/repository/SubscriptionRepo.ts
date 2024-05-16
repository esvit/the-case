import {ISubscriptionRepo} from "../../../../domain/exchangeSubscription/repository/ISubscriptionRepo";
import {Email} from "../../../../domain/exchangeSubscription/valueObject/Email";
import {Subscriber} from "../models/Subscriber";
import {getModelsPager} from "../helpers/model";

export default
class SubscriptionRepo implements ISubscriptionRepo {
  async subscribe(emailObj: Email): Promise<boolean> {
    const email = emailObj.toPrimitive();
    const item = await Subscriber.findOne({ where: { email } });
    if (item) {
      return false;
    }
    await Subscriber.create({ email });
    return true;
  }

  async *getSubscribers() : AsyncGenerator<Email> {
    const page = getModelsPager(Subscriber, {}, 50);
    for await (const item of page) {
      yield Email.create((<Subscriber>item).email);
    }
  }
}
