export interface Service {
  name: string,
  host: string,
  isRequired: boolean,
}

export interface AdapterResponse {
  isUp: boolean,
  error?: Error,
}

export interface Adapter extends Service {
  check(): Promise<AdapterResponse>;
}

export interface Response extends Service {
  isUp: boolean,
  elapsedTime: number,
  error?: Error,
}

export interface Summary {
  count: number,
  up: number,
  totalElapsedTime: number,
  requiredDown: number,
  optionalDown: number,
  services: { [host: string]: Response },
}

function elapsedTime(beginning: number): number {
  return new Date().getTime() - beginning;
}

function summary(responses: Response[]): Summary {
  const reduced = responses.reduce((agg, service) => {
    const totalElapsedTime = agg.totalElapsedTime + service.elapsedTime;
    agg.services[service.name] = service;

    if (service.isUp) {
      return {
        ...agg,
        up: agg.up + 1,
        totalElapsedTime,
      };
    }

    if (service.isRequired) {
      if (!service.isUp) {
        return {
          ...agg,
          requiredDown: agg.requiredDown + 1,
          totalElapsedTime,
        };
      }
    }

    return {
      ...agg,
      optionalDown: agg.optionalDown + 1,
      totalElapsedTime,
    };
  }, {
    up: 0,
    totalElapsedTime: 0,
    requiredDown: 0,
    optionalDown: 0,
    services: {},
  } as Summary);

  return {
    count: responses.length,
    ...reduced,
  };
}

async function check(adapters: Adapter[]): Promise<Response[]> {
  return Promise.all(adapters.map(async (adapter) => {
    const beginning = new Date().getTime();

    const details = {
      name: adapter.name,
      host: adapter.host,
      isRequired: adapter.isRequired,
    };

    try {
      const result = await adapter.check();

      return {
        ...details,
        isUp: result.isUp,
        elapsedTime: elapsedTime(beginning),
        error: result.error || null,
      };
    } catch (e) {
      return {
        ...details,
        isUp: false,
        elapsedTime: elapsedTime(beginning),
        error: e,
      };
    }
  }));
}

export default async function healthcheck(adapters: Adapter[]): Promise<Summary> {
  return summary(await check(adapters));
}
