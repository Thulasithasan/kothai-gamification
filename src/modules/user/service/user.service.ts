import UserRepository from '../data/repository/user.repository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../data/dtos/user.dto';
import * as EmailService from '../../base/services/email.service';
import { EmailTemplateType } from '@/modules/base/enums/email.template.type';
import { ChangePasswordRequest } from '../controller/request/change.password.request';

import {
  BaseResponse,
  CreatedUpdatedResponse,
} from '../../base/controller/responses/base.repsonse';
import { ForgotPasswordRequest } from '../controller/request/forgot.password.request';
import {
  UserListResponse,
  UserProfileResponse,
} from '../controller/response/user.response';
import { LoginResponse } from '../controller/response/auth.response';
import { UserJWT } from '../data/dtos/user.jwt.dto';

import {
  SaveUserRequest,
  UpdateUserRequest,
  AdminUpdateUserRequest,
} from '../controller/request/user.request';
import { UserListRequest } from '../controller/request/user.list.request';
import { isValidObjectId } from 'mongoose';
import AssetService from '../../asset/service/asset.service';
import BaseRepository from '@/modules/base/data/repository/base.repository';
import { RoleDTO } from '@/modules/user/data/dtos/role.dto';
import crypto from 'crypto';
import { log } from 'console';

const getUsers = async (
  listReq: UserListRequest
): Promise<UserListResponse> => {
  const list = await UserRepository.findUsers(listReq);
  
  const users = await Promise.all(list.users.map(async (user) => {
    // Handle profile image
    let profileImageUrl = user.profileImage?.toString();
    if (profileImageUrl) {
      const url = ''; // TODO;
      if (url !== null) {
        profileImageUrl = url;
      }
    }

    // Map role information
    const roleInfo = user.roles.map((role: any) => ({
      name: role.name,
      type: role.type,
      description: role.description
    }));

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: roleInfo,
      address1: user.address1,
      address2: user.address2,
      city: user.city,
      phoneNumber: user.phoneNumber,
      profileImage: profileImageUrl,
      isVerified: user.isVerified,
      isPremiumCustomer: user.isPremiumCustomer,
      isAvailability: user.isAvailability,
      isAdvertisementsEnabled: user.isAdvertisementsEnabled,
      isActive: user.isActive,
      approvalStatus: user.approvalStatus,
    };
  }));

  return {
    status: true,
    totalCount: list.total,
    users,
  } as UserListResponse;
};

const getUser = async (req: any): Promise<UserProfileResponse> => {
  const user: UserModel | null = await UserRepository.findById(
    req.userData.id
  );

  if (user === null) {
    throw new Error('User not found');
  }

  // Handle profile image
  let profileImageUrl = user.profileImage?.toString();
  if (profileImageUrl) {
    const url = ''; // TODO;
    if (url !== null) {
      profileImageUrl = url;
    }
  }

  // Map role information
  const roleInfo = user.roles.map((role: any) => ({
    name: role.name,
    type: role.type,
    description: role.description
  }));

  const userData = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    roles: roleInfo,
    address1: user.address1,
    address2: user.address2,
    city: user.city,
    phoneNumber: user.phoneNumber,
    profileImage: profileImageUrl,
    isVerified: user.isVerified,
    isPremiumCustomer: user.isPremiumCustomer,
    isAvailability: user.isAvailability,
    isAdvertisementsEnabled: user.isAdvertisementsEnabled,
    isActive: user.isActive,
    approvalStatus: user.approvalStatus,
  };

  return { status: true, user: userData } as UserProfileResponse;
};

const saveUser = async (
  createUserRequest: SaveUserRequest
): Promise<CreatedUpdatedResponse> => {
  // Check if user exists
  const checkUser = await UserRepository.findByEmail(
    createUserRequest.email
  );
  if (checkUser !== null) throw new Error('User already exists');

  // Validate roles
  for (const roleId of createUserRequest.roles) {
    if (!isValidObjectId(roleId)) {
      throw new Error(`Invalid role ID: ${roleId}`);
    }
    const role = await BaseRepository.findById(RoleDTO, roleId);
    if (!role) {
      throw new Error(`Role not found with ID: ${roleId}`);
    }
  }

  // Save user with roles
  const id: string | null = await UserRepository.saveUser(createUserRequest);
  if (id != null) {
    return { status: true, id } as CreatedUpdatedResponse;
  }
  throw new Error('User not inserted');
};

const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

const login = async (req: any) => {
  const checkUser = await UserRepository.findByEmail(req.body.email);
  if (checkUser == null) throw new Error('User not found');

  const compareRes: boolean = await bcrypt.compare(
    req.body.password,
    checkUser.password
  );

  if (compareRes) {
    // Generate access token (short-lived)
    const accessToken = jwt.sign(
      {
        email: checkUser.email,
        id: checkUser._id,
        roles: checkUser.roles,
      },
      process.env.SECRET!,
      {
        expiresIn: '15m', // Short-lived access token (15 minutes)
      }
    );

    // Generate refresh token (long-lived)
    const refreshToken = generateRefreshToken();
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7); // 7 days expiry

    // Store refresh token in user document
    await UserRepository.updateRefreshToken(
      checkUser._id!.toString(),
      refreshToken,
      refreshTokenExpiry
    );

    // Get role names from populated roles
    const roleNames = checkUser.roles.map((role: any) => role.name);

    return {
      status: true,
      firstName: checkUser.firstName,
      lastName: checkUser.lastName,
      email: checkUser.email,
      userId: checkUser._id!.toString(),
      accessToken,
      refreshToken,
      roles: roleNames,
    } as LoginResponse;
  }
  throw new Error('Invalid credentials');
};

const forgotPassword = async (
  forgotPasswordRequest: ForgotPasswordRequest
): Promise<BaseResponse> => {
  if (forgotPasswordRequest.email == null)
    throw new Error('Email not found');
  const user = await UserRepository.findByEmail(
    forgotPasswordRequest.email
  );
  if (user === null) throw new Error('User not found');
  const otp = await UserRepository.setPasswordResetOtp(
    user._id!.toString()
  );
  const emailSent = await EmailService.send(
    user?.email ?? '',
    EmailTemplateType.forgotPassword,
    {
      expiresIn: process.env.OTP_EXPIRES_HOURS,
      otp,
      name: user.firstName,
    }
  );
  if (!emailSent) throw new Error('Email not sent');

  return {
    status: true,
    message: 'OTP sent successfully',
  } as BaseResponse;
};

const resetPassword = async (
  changePasswordRequest: ChangePasswordRequest
): Promise<BaseResponse> => {
  console.log(changePasswordRequest.email);
  const user = await UserRepository.findByEmail(
    changePasswordRequest.email
  );

  if (user === null) throw new Error('User not found');

  const diff =
    new Date().getTime() -
    (user?.otpExpiresAt ?? new Date()).getTime();
  if (diff > 0) {
    throw new Error('OTP Expired');
  }
  const passwordChanged = await UserRepository.changePassword(
    user._id!.toString(),
    changePasswordRequest.email,
    changePasswordRequest.password
  );
  if (!passwordChanged)
    throw new Error('Error while updating the password');
  const emailSent = await EmailService.send(
    user.email ?? '',
    EmailTemplateType.changePassword,
    {
      name: user.firstName,
    }
  );
  if (!emailSent) throw new Error('Email not sent');
  const resetOTP = await UserRepository.resetPasswordResetOtp(
    user._id!.toString()
  );
  if (!resetOTP) throw new Error('OTP not reset');
  return {
    status: true,
    message: 'Password reset success',
  } as BaseResponse;
};

const updateUser = async (
  updateUserRequest: UpdateUserRequest,
  userData: UserJWT
): Promise<CreatedUpdatedResponse> => {
  const id: string | null = await UserRepository.updateUser(
    updateUserRequest,
    userData.userId
  );
  if (id != null) {
    return { status: true, id } as CreatedUpdatedResponse;
  }
  throw new Error('User not Updated');
};

const adminUpdateUser = async (
  adminUpdateUserRequest: AdminUpdateUserRequest
): Promise<CreatedUpdatedResponse> => {
  const id: string | null = await UserRepository.adminUpdateUser(
    adminUpdateUserRequest,
    adminUpdateUserRequest.id
  );
  if (id != null) {
    return { status: true, id } as CreatedUpdatedResponse;
  }
  throw new Error('User not Updated');
};

// Add new function to refresh tokens
const refreshToken = async (refreshToken: string) => {
  const user = await UserRepository.findByRefreshToken(refreshToken);
  
  if (!user) {
    throw new Error('Invalid refresh token');
  }

  // Check if refresh token has expired
  const refreshTokenData = user.refreshTokens?.find(
    (rt) => rt.token === refreshToken
  );
  
  if (!refreshTokenData || refreshTokenData.expiresAt < new Date()) {
    throw new Error('Refresh token has expired');
  }

  // Generate new access token
  const accessToken = jwt.sign(
    {
      email: user.email,
      id: user._id,
      roles: user.roles,
    },
    process.env.SECRET!,
    {
      expiresIn: '15m',
    }
  );

  return {
    status: true,
    accessToken,
  };
};

// Add new function to logout (invalidate refresh token)
const logout = async (  userData: UserJWT
  , refreshToken: string) => {
    console.log(userData.id);
  await UserRepository.removeRefreshToken(userData.id, refreshToken);
  return { status: true };
};

export default {
  getUsers,
  getUser,
  saveUser,
  login,
  forgotPassword,
  resetPassword,
  updateUser,
  adminUpdateUser,
  refreshToken,
  logout,
};
