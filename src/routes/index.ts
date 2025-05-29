import { Application } from 'express';
import appRouter from './app.route';
import { checkAuth } from '../middlewares/check.auth';
import { RoleTypeEnum } from '@/modules/user/enums/role';

const router = (app: Application) => {
  app.use('/api', appRouter);
};
export default router;
