/* istanbul ignore file */
import { initContainer } from '../../infra/container';
import { IServer } from '../../types';

(async function bootstrap() {
  const container = initContainer(__dirname);
  const server = container.resolve<IServer>('Server');
  return server.start();
})();
