import {
  BaseResponse,
  CountResponse,
} from '../../../base/controller/responses/base.repsonse';
import { AssetModel } from '../../data/dtos/asset.dto';

export interface AssetListResponse extends CountResponse {
  assets: Array<AssetModel>;
}

export interface AssetResponse extends BaseResponse {
  asset: AssetModel;
}
