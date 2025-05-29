import { ListRequest } from '../../../base/controller/request/list.request';

export interface UserListRequest extends ListRequest {
  isPremiumCustomer?: boolean;
  isVerified?: boolean;
  isAvailability?: boolean;
  isAdvertismentsEnabled?: boolean;
  isActive?: boolean;
  approvalStatus?: boolean;
  role?: string;
}
