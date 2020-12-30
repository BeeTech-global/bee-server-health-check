import { Adapter, AdapterResponse } from '../../src';

export default class AdapterMock implements Adapter {
  public constructor(
    public readonly host: string,
    public readonly isRequired: boolean,
    public readonly name: string,
    public readonly result: {
      isUp: boolean,
      waitFor: number,
      error: Error,
    },
  ) {}

  public async check(): Promise<AdapterResponse> {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    await sleep(this.result.waitFor);

    return {
      isUp: this.result.isUp,
      error: this.result.error,
    };
  }
}
