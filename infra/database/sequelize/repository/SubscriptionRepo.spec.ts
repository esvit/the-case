import SubscriptionRepo from "./SubscriptionRepo";
import {Subscriber} from "../models/Subscriber";
import {Email} from "../../../../domain/exchangeSubscription/valueObject/Email";
import { getModelsPager } from '../helpers/model';

jest.mock('../helpers/model', () => ({
  getModelsPager: jest.fn()
}));

describe('SubscriptionRepo', () => {
  let repo: SubscriptionRepo;
  beforeEach(() => {
    repo = new SubscriptionRepo();
  });
  test('subscribe', async () => {
    jest.spyOn(Subscriber, 'findOne').mockResolvedValue(<any>null);
    jest.spyOn(Subscriber, 'create').mockImplementation(<any>(() => {}));
    expect(await repo.subscribe(Email.create('test@mail.com'))).toBeTruthy();
    expect(Subscriber.create).toHaveBeenCalledWith({ email: 'test@mail.com' });

    (Subscriber.create as jest.Mock).mockClear();

    jest.spyOn(Subscriber, 'findOne').mockResolvedValue(<any>{ email: 'test@test.com' });
    jest.spyOn(Subscriber, 'create').mockImplementation(<any>(() => {}));
    expect(await repo.subscribe(Email.create('test@mail.com'))).toBeFalsy();
    expect(Subscriber.create).not.toHaveBeenCalled();
  });
  test('getSubscribers', async () => {
    (getModelsPager as jest.Mock).mockImplementation(function *() { yield { email: 'test@mail.com' } });
    const res = repo.getSubscribers();
    expect((await res.next() as any).value).toEqual(Email.create('test@mail.com'));
  });
});
