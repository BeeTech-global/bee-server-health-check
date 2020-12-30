import faker from 'faker';
import knex from 'knex';

import KnexDBAdapter from '../../../src/adapter/knex-db';

jest.mock('knex');

describe('Database with Knex adapter test', () => {
  const knexMock = {} as knex;

  it('Should return success when database is up', async () => {
    knexMock.select = jest.fn().mockResolvedValue(1);

    const adapter = new KnexDBAdapter(
      faker.hacker.adjective(),
      faker.internet.ip(),
      true,
      knexMock,
    );

    const result = await adapter.check();
    expect(result).toEqual({ isUp: true });
    expect(knexMock.select).toHaveBeenCalledTimes(1);
  });

  it('Should return error when database is down or unreachable', async () => {
    const error = new Error('fake error');
    knexMock.select = jest.fn().mockRejectedValue(error);

    const adapter = new KnexDBAdapter(
      faker.hacker.adjective(),
      faker.internet.ip(),
      true,
      knexMock,
    );

    const result = await adapter.check();
    expect(result).toEqual({
      isUp: false,
      error,
    });
    expect(knexMock.select).toHaveBeenCalledTimes(1);
  });
});
