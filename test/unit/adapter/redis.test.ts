import faker from 'faker';
import { Redis } from 'ioredis';

import RedisAdapter from '../../../src/adapter/redis';

describe('Redis adapter test', () => {
  const redisMock = {} as Redis;

  it('Should return success when ping method was successful', async () => {
    redisMock.ping = jest.fn().mockResolvedValue(true);

    const adapter = new RedisAdapter(
      faker.hacker.adjective(),
      faker.internet.ip(),
      true,
      redisMock,
    );

    const result = await adapter.check();
    expect(result).toEqual({ isUp: true });
  });

  it('Should return error when ping method fails', async () => {
    const error = new Error('fake error');
    redisMock.ping = jest.fn().mockRejectedValue(error);

    const adapter = new RedisAdapter(
      faker.hacker.adjective(),
      faker.internet.ip(),
      true,
      redisMock,
    );

    const result = await adapter.check();
    expect(result).toEqual({
      isUp: false,
      error,
    });
    expect(redisMock.ping).toHaveBeenCalledTimes(1);
  });
});
