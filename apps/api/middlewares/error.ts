import {RouterContext} from '@koa/router';
import { BadRequestError, NotFoundError } from '../errors';
import {ILogger} from "../../../types";

export
function errorMiddleware({ Logger }: { Logger: ILogger }, isProdEnv:boolean = false) {
  return async (ctx:RouterContext, next:Function):Promise<void> => {
    try {
      await next();
    } catch (err:any) {
      const { req } = ctx;
      const url = (req as any).originalUrl || req.url;
      const logExtras:any = {
        url,
        method: req.method,
        referer: req.headers.referer,
        tenantId: ctx.state.tenantId,
      };
      if (ctx.request && ctx.request.body) {
        logExtras.body = ctx.request.body;
      }
      const user = {
        ip_address: ctx.request.ip
      };
      Logger.captureException(err, logExtras, user);
      if (err instanceof BadRequestError) {
        return ctx.badRequest({ message: err.message });
      } else if (err instanceof NotFoundError) {
        return ctx.notFound({ message: err.message });
      }

      console.error(err);
      if (isProdEnv) {
        ctx.internalServerError({ message: 'Sorry, something went wrong. Please try again or contact support. Include a screenshot of this entire page so we can troubleshoot this issue faster.' });
      } else {
        ctx.status = err?.statusCode || 500;
        ctx.body = JSON.stringify(err && (err.toJSON ? err.toJSON() : { message: err.message, ...err }));
      }
    }
  };
}
