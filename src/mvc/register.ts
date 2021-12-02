import { RegisterDuplicateFailure } from '../errors/failure';
import { Controller } from './controller';
import { Service } from './service';
import { deleteRight, kebabize } from '../utils/string';

export const defaultSrvs: Record<string, Service> = {};

/**
 * Class Decorator for Services and Controllers
 */
export function register(name = '') {
  return function <T extends new (...args: any[]) => Service | Controller>(constructor: T) {
    const obj = new constructor();
    if (obj instanceof Service) {
      registerService(obj, name);
    }
  };
}

// eslint-disable-next-line @typescript-eslint/ban-types
function getName(obj: Object) {
  let name = obj.constructor.name;
  name = deleteRight(name, 'Service');
  name = deleteRight(name, 'Controller');
  name = kebabize(name);
  return name;
}

function registerService(service: Service, name = '') {
  if (!name) {
    name = getName(service);
  }
  if (name in defaultSrvs) {
    throw new RegisterDuplicateFailure(name);
  }
  defaultSrvs[name] = service;
}

// function registerController(name="", ) {
//   return function <T extends new (...args: any[]) => Controller>(constructor: T) {
//     if (!name) {
//       name = constructor.name
//       name = deleteRight(name, "Service")
//       name = kebabize(name)
//     }
//     if (name in defaultSrvs) {
//       throw new RegisterDuplicateFailure(name)
//     }
//     defaultSrvs[name] = new constructor()
//   };
// }
