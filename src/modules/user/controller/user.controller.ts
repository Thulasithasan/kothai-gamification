import { Request, Response } from 'express';
import { errorResponse } from '../../../utils/common.util';
import UserService from '../service/user.service';
import { LoginResponse, RefreshTokenResponse } from './response/auth.response';
import {
  BaseResponse,
  CreatedUpdatedResponse,
} from '../../base/controller/responses/base.repsonse';
import { ChangePasswordRequest } from './request/change.password.request';
import { ForgotPasswordRequest } from './request/forgot.password.request';
import {
  UserListResponse,
  UserProfileResponse,
} from './response/user.response';
import { UserJWT } from '../data/dtos/user.jwt.dto';
import {
  AdminUpdateUserRequest,
  SaveUserRequest,
  UpdateUserRequest,
} from './request/user.request';
import { UserListRequest } from './request/user.list.request';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const response: UserListResponse = await UserService.getUsers(
      req.query as unknown as UserListRequest
    );
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const response: UserProfileResponse =
      await UserService.getUser(req);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const saveUser = async (req: Request, res: Response) => {
  try {
    const response: CreatedUpdatedResponse =
      await UserService.saveUser(
        req.body as unknown as SaveUserRequest
      );
    res.status(201).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const response: LoginResponse = await UserService.login(req);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const response: BaseResponse = await UserService.forgotPassword(
      req.body as unknown as ForgotPasswordRequest
    );
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};
export const changePassword = async (req: Request, res: Response) => {
  try {
    const response: BaseResponse = await UserService.resetPassword(
      req.body as unknown as ChangePasswordRequest
    );
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const updateUser = async (req: any, res: Response) => {
  try {
    const response: CreatedUpdatedResponse =
      await UserService.updateUser(
        req.body as unknown as UpdateUserRequest,
        req.userData as unknown as UserJWT
      );
    res.status(201).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const adminUpdateUser = async (
  req: Request,
  res: Response
) => {
  try {
    const response: CreatedUpdatedResponse =
      await UserService.adminUpdateUser(
        req.body as unknown as AdminUpdateUserRequest
      );
    res.status(201).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const response: RefreshTokenResponse = await UserService.refreshToken(
      req.body.refreshToken
    );
    res.status(200).json(response);
  } catch (error: any) {
    res.status(401).json(errorResponse(error.message));
  }
};

export const logout = async (req: any, res: Response) => {
  try {
    const response: BaseResponse = await UserService.logout(
      req.userData as unknown as UserJWT,
      req.body.refreshToken
    );
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};
