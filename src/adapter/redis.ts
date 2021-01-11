import { Redis } from 'ioredis';

import { Adapter, AdapterResponse } from '..';

export default class RedisAdapter implements Adapter {
  public constructor(
    public readonly name: string,
    public readonly host: string,
    public readonly isRequired: boolean,
    private readonly redisInstance: Redis,
  ) {}

  public async check(): Promise<AdapterResponse> {
    try {
      await this.redisInstance.ping();

      return {
        isUp: true,
      };
    } catch (error) {
      return {
        isUp: false,
        error,
      };
    }
  }
}
