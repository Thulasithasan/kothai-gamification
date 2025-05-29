import { BaseResponse, CountResponse } from '../../../base/controller/responses/base.repsonse';
import { UserModel } from '../../data/dtos/user.dto';
import { RoleTypeEnum } from '../../enums/role';

interface RoleInfo {
  name: string;
  type: RoleTypeEnum;
  description?: string;
}

export interface UserResponseData {
  firstName: string;
  lastName: string;
  email: string;
  roles: RoleInfo[];
  address1?: string;
  address2?: string;
  city?: string;
  phoneNumber?: string;
  profileImage?: string;
  isVerified?: boolean;
  isPremiumCustomer?: boolean;
  isAvailability?: boolean;
  isAdvertisementsEnabled?: boolean;
  isActive?: boolean;
  approvalStatus?: boolean;
}

export interface UserListResponse extends CountResponse {
  users: UserResponseData[];
}

export interface UserProfileResponse extends BaseResponse {
  user: UserResponseData;
}
