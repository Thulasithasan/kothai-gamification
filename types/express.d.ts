import { UserJWT } from '@/modules/user/data/dtos/user.jwt.dto';
declare module 'express' {
  interface Request {
    user?: UserJWT;
  }
}

export default global;
