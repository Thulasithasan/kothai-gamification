import { Router } from 'express';
import { createRole, getRole, getRoles, softDelete, updateRole } from '../../../controller/role.controller';
import { checkAuth } from '@/src/middlewares/check.auth';
import { RoleTypeEnum } from '@/modules/user/enums/role';

const roleRouter: Router = Router();

// Role routes
roleRouter.get('/list', checkAuth(RoleTypeEnum.ADMIN),
    getRoles);
roleRouter.get('/:id', getRole);
roleRouter.post('/', checkAuth(RoleTypeEnum.ADMIN),
    createRole);
roleRouter.put(
    '/:id',
    checkAuth(RoleTypeEnum.ADMIN),
    updateRole
);
roleRouter.delete(
    '/:id',
    checkAuth(RoleTypeEnum.ADMIN),
    softDelete
);

export default roleRouter;
