import { Router } from 'express';
import {
  saveUser,
  getUser,
  updateUser,
  getUsers,
  adminUpdateUser,
} from '../../../controller/user.controller';
import { checkAuth } from '@/src/middlewares/check.auth';
import { RoleTypeEnum } from '@/modules/user/enums/role';

const userRouter: Router = Router();

// User routes
userRouter.get('/profile', checkAuth, getUser);
userRouter.get('/list', getUsers);
userRouter.post('/signup', saveUser);
userRouter.post('/update', checkAuth(RoleTypeEnum.USER), updateUser);
userRouter.post('/update/admin', checkAuth(RoleTypeEnum.ADMIN), adminUpdateUser);


export default userRouter;
