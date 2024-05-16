import {errorMiddleware} from './error';
import {BadRequestError, NotFoundError} from '../errors';

test('errorMiddleware', async () => {
  const Logger: any = {
    captureException: jest.fn(),
    error: jest.fn()
  };
  const func = errorMiddleware({Logger}, true);
  const state = {
    tenantId: 1,
    user: {
      Id: 1,
      Email: 'test@no-mail.com'
    },
    scope: {
      resolve: jest.fn().mockImplementation(() => jest.fn())
    }
  };
  const ctx: any = {
    status: 0,
    body: null,
    state,
    req: { method: 'get', headers: { referer: '/test' } },
    request: { ip: '10.0.0.1' },
    badRequest: jest.fn(),
    ok: jest.fn(),
    forbidden: jest.fn(),
    notFound: jest.fn(),
    internalServerError: jest.fn(),
  };
  const err = new Error('Test');
  await func(ctx, async () => {
    throw err;
  });
  expect(Logger.captureException).toHaveBeenCalledWith(err, {"method": 'get', "referer": "/test", "tenantId": 1, "url": undefined}, {"email": undefined, "id": undefined, "ip_address": "10.0.0.1"});
  expect(ctx.internalServerError).toHaveBeenCalledWith({
    message: 'Sorry, something went wrong. Please try again or contact support. Include a screenshot of this entire page so we can troubleshoot this issue faster.'
  });
  await func(ctx, async () => {
    throw new BadRequestError('Invalid field');
  });
  expect(ctx.badRequest).toHaveBeenCalledWith({message: 'Invalid field'});
  ctx.badRequest.mockClear();
  await func(ctx, async () => {
    throw new NotFoundError('Not found');
  });
  expect(ctx.notFound).toHaveBeenCalledWith({message: 'Not found'});

  ctx.internalServerError.mockReset();
  Logger.captureException.mockReset();

  const func2 = errorMiddleware({Logger}, false);
  const err2 = new Error('Test');
  await func2(ctx, async () => {
    throw err2;
  });
  expect(Logger.captureException).toHaveBeenCalledWith(err2, {"method": 'get', "referer": "/test", "tenantId": 1, "url": undefined}, {"email": undefined, "id": undefined, "ip_address": "10.0.0.1"});
  expect(ctx.status).toEqual(500);
  expect(ctx.body).toEqual(JSON.stringify({message: 'Test'}));
});
