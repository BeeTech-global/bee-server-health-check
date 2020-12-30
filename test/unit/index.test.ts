import faker from 'faker';

import healthcheck from '../../src';
import AdapterMock from '../mock/adapter';

describe('health check main library', () => {
  const tests = [
    {
      description: 'it should return all services as up',
      checks: [
        new AdapterMock(
          faker.internet.ip(),
          true,
          faker.hacker.adjective(),
          {
            isUp: true,
            waitFor: 1000,
            error: null,
          },
        ),
        new AdapterMock(
          faker.internet.ip(),
          true,
          faker.hacker.adjective(),
          {
            isUp: true,
            waitFor: 2000,
            error: null,
          },
        ),
        new AdapterMock(
          faker.internet.ip(),
          true,
          faker.hacker.adjective(),
          {
            isUp: true,
            waitFor: 1500,
            error: null,
          },
        ),
      ],
    },
    {
      description: 'it should return all services as down',
      checks: [
        new AdapterMock(
          faker.internet.ip(),
          true,
          faker.hacker.adjective(),
          {
            isUp: false,
            waitFor: 1000,
            error: new Error('service down'),
          },
        ),
        new AdapterMock(
          faker.internet.ip(),
          true,
          faker.hacker.adjective(),
          {
            isUp: false,
            waitFor: 2000,
            error: new Error('service down'),
          },
        ),
        new AdapterMock(
          faker.internet.ip(),
          true,
          faker.hacker.adjective(),
          {
            isUp: false,
            waitFor: 1500,
            error: new Error('service down'),
          },
        ),
      ],
    },
    {
      description: 'it should return a mix of services up and down',
      checks: [
        new AdapterMock(
          faker.internet.ip(),
          true,
          faker.hacker.adjective(),
          {
            isUp: true,
            waitFor: 1000,
            error: null,
          },
        ),
        new AdapterMock(
          faker.internet.ip(),
          true,
          faker.hacker.adjective(),
          {
            isUp: false,
            waitFor: 2000,
            error: null,
          },
        ),
        new AdapterMock(
          faker.internet.ip(),
          true,
          faker.hacker.adjective(),
          {
            isUp: true,
            waitFor: 1500,
            error: null,
          },
        ),
      ],
    },
  ];

  tests.forEach((test) => {
    it(test.description, async () => {
      const result = await healthcheck(test.checks);
      const expected = test.checks.map((check) => ({
        name: check.name,
        host: check.host,
        isRequired: check.isRequired,
        isUp: check.result.isUp,
        elapsedTime: expect.anything(),
        error: check.result.error,
      }));

      expect(result).toEqual(expected);
      result.forEach((resultItem, index) => {
        expect(resultItem.elapsedTime / 1000)
          .toBeCloseTo(test.checks[index].result.waitFor / 1000); // test the approximation
      });
    });
  });
});
