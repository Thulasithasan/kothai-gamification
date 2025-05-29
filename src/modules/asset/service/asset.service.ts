import { AssetDTO, AssetModel } from '../data/dtos/asset.dto';
import BaseRepository from '@/modules/base/data/repository/base.repository';
import { ListRequest } from '../../base/controller/request/list.request';
import { CreateUpdateAssetRequest } from '../controller/request/asset.request';
import {
  AssetListResponse,
  AssetResponse,
} from '../controller/response/asset.response';
import {
  BaseResponse,
  CreatedUpdatedResponse,
} from '../../base/controller/responses/base.repsonse';

const getAssets = async (
  listReq: ListRequest
): Promise<AssetListResponse> => {
  const query = { isDeleted: false } as any;
  if (listReq.search) {
    query.$or = {
      key: {
        $regex: '.*' + listReq.search ? listReq.search : '.*',
        $options: 'i',
      },
    };
  }
  const assets = await BaseRepository.findAll(
    AssetDTO,
    query,
    listReq.skip,
    listReq.limit
  );
  return {
    status: true,
    totalCount: assets.totalCount,
    assets: assets.items,
  };
};

const getAsset = async (id: string): Promise<AssetResponse> => {
  const asset = await BaseRepository.findById(AssetDTO, id);
  if (!asset) throw new Error(`Asset not found for id ${id}`);
  return { status: true, asset };
};

const createAsset = async (
  assetData: CreateUpdateAssetRequest
): Promise<CreatedUpdatedResponse> => {
  const assetId = await BaseRepository.create(AssetDTO, assetData);
  if (!assetId) throw new Error('Create fail');
  return { status: true, id: assetId };
};

const updateAsset = async (
  id: string,
  assetData: CreateUpdateAssetRequest
): Promise<CreatedUpdatedResponse> => {
  const asset = await BaseRepository.updateById(
    AssetDTO,
    id,
    assetData
  );
  if (!asset) throw new Error('Update fail');
  return { status: true, id: asset.id };
};

const softDelete = async (id: string): Promise<BaseResponse> => {
  await BaseRepository.softDeleteById(AssetDTO, id);
  return { status: true };
};

export default {
  getAssets,
  getAsset,
  createAsset,
  updateAsset,
  softDelete,
};
