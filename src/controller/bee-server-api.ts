import Server from '@beetech/bee-server-api';
import httpStatus from 'http-status-codes';

import healthcheck, { Adapter } from '..';

export default class BeeServerApiController {
  public constructor(
    private readonly appName: string,
    private readonly appVersion: string,
    private readonly checkAdapters: Adapter[],
  ) {}

  public async basic(ctx: Server.BaseContext): Promise<void> {
    ctx.response.status = httpStatus.OK;
    ctx.response.body = {
      name: this.appName,
      version: this.appVersion,
    };
  }

  public async detailed(ctx: Server.BaseContext): Promise<void> {
    const result = await healthcheck(this.checkAdapters);
    const summary = result.reduce((agg, service) => {
      const totalElapsedTime = agg.totalElapsedTime + service.elapsedTime;

      if (service.isUp) {
        return {
          ...agg,
          up: agg.up + 1,
          totalElapsedTime,
        };
      }

      if (service.isRequired) {
        if (service.isUp) {
          return {
            ...agg,
            requiredDown: agg.requiredDown + 1,
            totalElapsedTime,
          };
        }
      }

      return {
        ...agg,
        optionalDown: agg.optionalDown + 1,
        totalElapsedTime,
      };
    }, {
      up: 0,
      totalElapsedTime: 0,
      requiredDown: 0,
      optionalDown: 0,
    });

    ctx.response.status = summary.requiredDown > 0 ? httpStatus.SERVICE_UNAVAILABLE : httpStatus.OK;
    ctx.response.body = {
      name: this.appName,
      version: this.appVersion,
      summary,
      services: result,
    };
  }
}
