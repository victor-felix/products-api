import { Router } from 'express';
import adapterRoute from '@external/http/express-route-adapter';
import Controller from '@adapters/controllers/port/controller';
import controllerFactory, {
  ContainerVersion,
} from '@external/dependency-injection/factory';
import fileUpload from '@main/middlewares/file-upload';

export default (router: Router): void => {
  router.post('/v1/tag', [
    adapterRoute(
      controllerFactory<Controller>(
        'CreateTagController',
        ContainerVersion.V1,
      ),
    ),
  ]);
  router.post('/v1/tag/:id/products', [
    fileUpload(),
    adapterRoute(
      controllerFactory<Controller>(
        'ImportJsonTagProductsByPathController',
        ContainerVersion.V1,
      ),
    ),
  ]);
  router.put('/v1/tag/:id', [
    adapterRoute(
      controllerFactory<Controller>(
        'UpdateTagController',
        ContainerVersion.V1,
      ),
    ),
  ]);
  router.get('/v1/tag/:id', [
    adapterRoute(
      controllerFactory<Controller>(
        'GetTagByPathController',
        ContainerVersion.V1,
      ),
    ),
  ]);
  router.get('/v1/tag', [
    adapterRoute(
      controllerFactory<Controller>(
        'GetTagByQueryController',
        ContainerVersion.V1,
      ),
    ),
  ]);
  router.get('/v1/tag/:id/products', [
    adapterRoute(
      controllerFactory<Controller>(
        'ExportJsonTagProductsByPathController',
        ContainerVersion.V1,
      ),
    ),
  ]);
  router.delete('/v1/tag/:id', [
    adapterRoute(
      controllerFactory<Controller>(
        'DeleteTagByPathController',
        ContainerVersion.V1,
      ),
    ),
  ]);
};
