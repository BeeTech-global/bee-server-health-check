import Server from '@beetech/bee-server-api';
import httpStatus from 'http-status-codes';

import healthcheck, { Adapter } from '../..';

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
    const summary = await healthcheck(this.checkAdapters);

    ctx.response.status = summary.requiredDown > 0 ? httpStatus.SERVICE_UNAVAILABLE : httpStatus.OK;
    ctx.response.body = {
      name: this.appName,
      version: this.appVersion,
      summary,
    };
  }
}
