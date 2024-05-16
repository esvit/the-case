import { createContainer, InjectionMode, asClass, asValue } from 'awilix';
import env from '../env';

const globalContainer = createContainer({
  injectionMode: InjectionMode.PROXY
});
globalContainer.register({
  env: asValue(env)
});

export
function InjectableService(options = {}) {
  return (service:any) => {
    const regServiceName = service.name;
    globalContainer.register({
      [regServiceName]: asClass(service, options)
    });
  };
}

export
function initContainer(dirname:string, scanFolders = []) {
  const scope = globalContainer.createScope();
  scope.register({
    DIContainer: asValue(scope)
  });
  return scope.loadModules([
    `${dirname}/**/!(*.spec|*.d|index).{ts,js}`,
    `${dirname}/../../infra/**/repository/**/!(*.spec|*.d).{ts,js}`,
    `${dirname}/../../infra/**/providers/**/!(*.spec|*.d).{ts,js}`,
    `${dirname}/../../domain/**/service/**/!(*.spec|*.d).{ts,js}`,
    ...scanFolders
  ], {
    resolverOptions: {}
  });
}
