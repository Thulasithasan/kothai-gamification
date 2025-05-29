import { Application } from 'express';
import swaggerUI from 'swagger-ui-express';
import appDocs from './app';
import adminDocs from './admin';

const doc = (app: Application) => {
  // App api swagger doc
  app.use(
    '/api/app/docs',
    swaggerUI.serveFiles(appDocs),
    swaggerUI.setup(appDocs)
  );

  // Admin api swagger doc
  app.use(
    '/api/admin/docs',
    swaggerUI.serveFiles(adminDocs),
    swaggerUI.setup(adminDocs)
  );
};

export default doc;
