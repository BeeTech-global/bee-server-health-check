import faker from 'faker';

import healthcheck from '../../src';
import AdapterMock from '../mock/adapter';

describe('health check main library', () => {
  const tests = [
    {
      description: 'it should return all services as up',
      up: 3,
      totalElapsedTime: 4500,
      requiredDown: 0,
      optionalDown: 0,
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
      up: 0,
      totalElapsedTime: 4500,
      requiredDown: 3,
      optionalDown: 0,
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
      up: 2,
      totalElapsedTime: 4500,
      requiredDown: 1,
      optionalDown: 0,
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
      const expected = {
        count: test.checks.length,
        up: test.up,
        totalElapsedTime: expect.anything(), // @todo: try o test the approximate value here
        requiredDown: test.requiredDown,
        optionalDown: test.optionalDown,
        services: test.checks.reduce((agg, check) => ({
          ...agg,
          [check.name]: {
            name: check.name,
            host: check.host,
            isRequired: check.isRequired,
            isUp: check.result.isUp,
            elapsedTime: expect.anything(),
            error: check.result.error,
          },
        }), {}),
      };

      expect(result).toEqual(expected);

      test.checks.forEach((check) => {
        expect(result.services[check.name].elapsedTime / 1000)
          .toBeCloseTo(check.result.waitFor / 1000); // test the approximation
      });
    });
  });
});
