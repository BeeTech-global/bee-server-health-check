import axios from 'axios';
import faker from 'faker';
import { mocked } from 'ts-jest/utils';

import ApiAdapter from '../../../src/adapter/api';

jest.mock('axios');

describe('Api adapter test', () => {
  afterEach(() => {
    mocked(axios.request).mockRestore();
  });

  it('Should return success when api is up', async () => {
    mocked(axios.request).mockResolvedValue({
      status: 200,
      data: {},
    });

    const adapter = new ApiAdapter(
      faker.hacker.adjective(),
      faker.internet.ip(),
      true,
    );

    const result = await adapter.check();
    expect(result).toEqual({ isUp: true });
  });

  it('Should return error when api is down or unreachable', async () => {
    const error = new Error('Fake error');
    mocked(axios.request).mockRejectedValue(error);

    const adapter = new ApiAdapter(
      faker.hacker.adjective(),
      faker.internet.ip(),
      true,
    );

    const result = await adapter.check();
    expect(result).toEqual({
      isUp: false,
      error,
    });
  });
});
