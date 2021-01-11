import httpStatus from 'http-status-codes';
import { BeeModel } from '@beetech/bee-server-entities';

const basicHealthcheckModel = new BeeModel({
  title: 'HealthCheck',
  properties: {
    name: {
      type: 'string',
      isRequired: true,
    },
    version: {
      type: 'string',
      isRequired: true,
    },
  },
});

const serviceModel = new BeeModel({
  title: 'Service details',
  properties: {
    name: {
      type: 'string',
      isRequired: true,
    },
    host: {
      type: 'string',
      isRequired: true,
    },
    isRequired: {
      type: 'boolean',
      isRequired: true,
    },
    isUp: {
      type: 'boolean',
      isRequired: true,
    },
    elapsedTime: {
      type: 'number',
      isRequired: true,
    },
    error: {
      type: 'string',
      isRequired: false,
    },
  },
});

const summaryModel = new BeeModel({
  title: 'Summary',
  properties: {
    count: {
      type: 'number',
      isRequired: true,
    },
    totalElapsedTime: {
      type: 'number',
      isRequired: true,
    },
    requiredDown: {
      type: 'number',
      isRequired: true,
    },
    optionalDown: {
      type: 'number',
      isRequired: true,
    },
    services: {
      type: 'array',
      items: serviceModel.JSONSchema,
    },
  },
});

const healthcheckModel = new BeeModel({
  title: 'HealthCheck',
  properties: {
    name: {
      type: 'string',
      isRequired: true,
    },
    version: {
      type: 'string',
      isRequired: true,
    },
    summary: {
      schema: summaryModel.JSONSchema,
    },
  },
});

function detailedHealthcheck(handler: CallableFunction) {
  return {
    handlers: handler,
    tags: ['Health Check'],
    summary: 'Health check',
    responses: {
      [httpStatus.OK]: {
        'application/json': {
          schema: healthcheckModel.JSONSchema,
        },
      },
      [httpStatus.SERVICE_UNAVAILABLE]: {
        'application/json': {
          schema: healthcheckModel.JSONSchema,
        },
      },
    },
  };
}

function basicHealthcheck(handler: CallableFunction) {
  return {
    handlers: handler,
    tags: ['Basic Healthcheck'],
    summary: 'Baisc Healthcheck',
    responses: {
      [httpStatus.OK]: {
        'application/json': {
          schema: basicHealthcheckModel.JSONSchema,
        },
      },
    },
  };
}

export default {
  detailedHealthcheck,
  basicHealthcheck,
};
