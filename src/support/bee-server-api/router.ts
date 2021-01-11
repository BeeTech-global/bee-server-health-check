import { Adapter } from '../..';
import docs from './docs';
import BeeServerApiController from './controller';

export default function healthCheckRoutes(
  appName: string,
  appVersion: string,
  adapters: Adapter[],
  router,
) {
  const controller = new BeeServerApiController(appName, appVersion, adapters);

  return router
    .get('/', docs.basicHealthcheck((ctx) => controller.basic(ctx)))
    .get('/_healthcheck', docs.detailedHealthcheck((ctx) => controller.detailed(ctx)));
}
