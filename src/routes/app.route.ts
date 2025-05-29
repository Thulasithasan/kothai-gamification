import { Router } from 'express';
import { authRouter, userRouter } from '@/modules/user/routes/app/v1';
import { assetAppRouter } from '@/modules/asset/routes';
import roleRouter from '@/modules/user/routes/app/v1/role.route';
import challengesRouter from '@/modules/challenges/routes/app/v1/challenges.route';

const appRouter: Router = Router();

// V1 routes
appRouter.use('/v1/user', userRouter);
appRouter.use('/v1/auth', authRouter);
appRouter.use('/v1/assets', assetAppRouter);
appRouter.use('/v1/role', roleRouter);
appRouter.use('/v1/challenges', challengesRouter);


export default appRouter;
