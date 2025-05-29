import { z } from 'zod';
import { RoleTypeEnum } from '../../enums/role';

const createUpdateRoleSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .max(30, {
      message: 'Maximum number of name is 30',
    }),
  type: z.nativeEnum(RoleTypeEnum, {
    required_error: 'Role type is required',
  }),
  description: z.string({
    required_error: 'Description is required',
  }),
});

type CreateUpdateRoleRequest = z.infer<typeof createUpdateRoleSchema>;

export { type CreateUpdateRoleRequest, createUpdateRoleSchema };
