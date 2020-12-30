import axios from 'axios';

import { Adapter, AdapterResponse } from '../index';

export default class ApiAdapter implements Adapter {
  public constructor(
    public readonly name: string,
    public readonly host: string,
    public readonly isRequired: boolean,
  ) {
  }

  public async check(): Promise<AdapterResponse> {
    try {
      await axios.request({
        url: this.host,
        method: 'get',
      });

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
