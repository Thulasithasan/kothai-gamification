import { BaseResponse, CountResponse } from '../../../base/controller/responses/base.repsonse';
import { ChallengeDTO } from '../../data/dtos/challenges.dto';
import { RoleTypeEnum } from '../../enums/role';

export interface ChallengeResponseData {
  title: string;
  description: string;
  type: string;
  level: number;
  content: string;
  timeLimit: number;
  accuracy: number;
  speed: number;
  isActive: boolean;
}

export interface ChallengeListResponse extends CountResponse {
  challenges: ChallengeResponseData[];
}

export interface ChallengeProfileResponse extends BaseResponse {
  challenge: ChallengeResponseData;
}
