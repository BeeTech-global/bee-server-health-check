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

function elapsedTime(beginning: number): number {
  return new Date().getTime() - beginning;
}

export default async function healthcheck(checks: Adapter[]): Promise<Response[]> {
  return Promise.all(checks.map(async (check) => {
    const beginning = new Date().getTime();

    const details = {
      name: check.name,
      host: check.host,
      isRequired: check.isRequired,
    };

    try {
      const result = await check.check();

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
