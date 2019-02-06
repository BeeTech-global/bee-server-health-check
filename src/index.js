const httpStatus = require('http-status-codes');

module.exports = function healthCheck({
  healthFn = async () => ({ ok: true }),
  successStatusCode = httpStatus.OK,
  failureStatusCode = httpStatus.SERVICE_UNAVAILABLE
} = {}) {
  return async (ctx) => {
    try {
      ctx.body = await healthFn(ctx);
      ctx.status = successStatusCode;
    } catch (err) {
      ctx.body = err;
      ctx.status = failureStatusCode;
    }
  };
};
