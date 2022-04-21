import { Router } from 'express';
import adapterRoute from '@external/http/express-route-adapter';
import Controller from '@adapters/controllers/port/controller';
import controllerFactory, {
  ContainerVersion,
} from '@external/dependency-injection/factory';

export default (router: Router): void => {
  router.post('/v1/product', [
    adapterRoute(
      controllerFactory<Controller>(
        'CreateProductController',
        ContainerVersion.V1,
      ),
    ),
  ]);
  router.put('/v1/product/:id', [
    adapterRoute(
      controllerFactory<Controller>(
        'UpdateProductController',
        ContainerVersion.V1,
      ),
    ),
  ]);
  router.get('/v1/product/:id', [
    adapterRoute(
      controllerFactory<Controller>(
        'GetProductByPathController',
        ContainerVersion.V1,
      ),
    ),
  ]);
  router.get('/v1/product', [
    adapterRoute(
      controllerFactory<Controller>(
        'GetProductByQueryController',
        ContainerVersion.V1,
      ),
    ),
  ]);
  router.delete('/v1/product/:id', [
    adapterRoute(
      controllerFactory<Controller>(
        'DeleteProductByPathController',
        ContainerVersion.V1,
      ),
    ),
  ]);
};
