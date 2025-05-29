import jwt from 'jsonwebtoken';
import { RoleTypeEnum } from '@/modules/user/enums/role';
import { Request, NextFunction, Response } from 'express';
import { UserJWT } from '@/modules/user/data/dtos/user.jwt.dto';
import { UserDTO } from '@/modules/user/data/dtos/user.dto';
import { RoleDTO } from '@/modules/user/data/dtos/role.dto';
import logger from '../dbs/logger';

// Define role hierarchy
const roleHierarchy = [
  RoleTypeEnum.USER,
  RoleTypeEnum.STAFF,
  RoleTypeEnum.ADMIN,
];

export const checkToken = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization) throw new Error();
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET!) as UserJWT;
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

export const checkAuth = (requiredRole: RoleTypeEnum) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract token from headers
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res
          .status(401)
          .json({ message: 'Unauthorized: No token provided' });
      }
      const token = authHeader.split(' ')[1];

      // Verify JWT token
      const decodedToken = jwt.verify(
        token,
        process.env.SECRET!
      ) as UserJWT;
      req.user = decodedToken;
      // Fetch user roles from DB
      const user = await UserDTO.findById(decodedToken.id).populate(
        'roles'
      );
      if (!user) {
        return res
          .status(401)
          .json({ message: 'Unauthorized: User not found' });
      }

      const userRoles = await RoleDTO.find({
        _id: { $in: user.roles },
      }).select('type');

      const userHighestRole = userRoles
        .map((role) => role.type)
        .reduce((highest, current) => {
          return roleHierarchy.indexOf(current as RoleTypeEnum) >
            roleHierarchy.indexOf(highest as RoleTypeEnum)
            ? current
            : highest;
        }, roleHierarchy[0]);

      // Check if the user's role satisfies the required role
      const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);
      const userRoleIndex = roleHierarchy.indexOf(
        userHighestRole as RoleTypeEnum
      );

      if (userRoleIndex < requiredRoleIndex) {
        return res
          .status(403)
          .json({ message: 'Forbidden: Insufficient role' });
      }

      next(); // Proceed to the next middleware
    } catch (error) {
      logger.error('Authorization error: Invalid token');
      return res
        .status(401)
        .json({ message: 'Unauthorized: Invalid token' });
    }
  };
};
