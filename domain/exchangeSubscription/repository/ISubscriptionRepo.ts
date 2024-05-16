import {Email} from "../valueObject/Email";

export interface ISubscriptionRepo {
  subscribe(email: Email): Promise<boolean>;
  getSubscribers() : AsyncGenerator<Email>;
}
