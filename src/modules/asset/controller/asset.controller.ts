import { Request, Response } from 'express';
import { errorResponse } from '@/utils/common.util';
import AssetService from '../service/asset.service';
import { CreateUpdateAssetRequest } from './request/asset.request';
import { ListRequest } from '../../base/controller/request/list.request';
import {
  AssetListResponse,
  AssetResponse,
} from './response/asset.response';
import {
  CreatedUpdatedResponse,
  BaseResponse,
} from '../../base/controller/responses/base.repsonse';

export const getAssets = async (req: Request, res: Response) => {
  try {
    const response: AssetListResponse = await AssetService.getAssets(
      req.query as unknown as ListRequest
    );
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const getAsset = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const response: AssetResponse = await AssetService.getAsset(id);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const createAsset = async (req: Request, res: Response) => {
  try {
    const response: CreatedUpdatedResponse =
      await AssetService.createAsset(
        req.body as CreateUpdateAssetRequest
      );
    res.status(201).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const updateAsset = async (req: Request, res: Response) => {
  try {
    const response: CreatedUpdatedResponse =
      await AssetService.updateAsset(
        req.params.id,
        req.body as CreateUpdateAssetRequest
      );
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const softDelete = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const response: BaseResponse = await AssetService.softDelete(id);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};
