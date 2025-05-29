import { JwtPayload } from 'jsonwebtoken';
import { RoleTypeEnum } from '@/modules/user/enums/role';

export interface UserJWT extends JwtPayload {
  id: string;
  email: string;
  role: Array<RoleTypeEnum>;
}
