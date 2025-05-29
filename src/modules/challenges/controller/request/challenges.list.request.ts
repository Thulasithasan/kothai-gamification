import { ListRequest } from '../../../base/controller/request/list.request';

export interface ChallengeListRequest extends ListRequest {
  activeStatus?: boolean;
  type?: string;
  level?: number;
}
