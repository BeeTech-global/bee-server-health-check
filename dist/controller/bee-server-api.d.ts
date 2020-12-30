import Server from '@beetech/bee-server-api';
import { Adapter } from '..';
export default class BeeServerApiController {
    private readonly appName;
    private readonly appVersion;
    private readonly checkAdapters;
    constructor(appName: string, appVersion: string, checkAdapters: Adapter[]);
    basic(ctx: Server.BaseContext): Promise<void>;
    detailed(ctx: Server.BaseContext): Promise<void>;
}
