// import knex from 'knex';

import { Adapter, AdapterResponse } from '../index';

export default class KnexDBAdapter implements Adapter {
  public constructor(
    public readonly name: string,
    public readonly host: string,
    public readonly isRequired: boolean,
    private readonly knexInstance: any, // knex,
  ) {
  }

  public async check(): Promise<AdapterResponse> {
    try {
      await this.knexInstance.select(1);

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
