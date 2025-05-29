import { Request, Response } from 'express';
import { errorResponse } from '@/utils/common.util';
import {
  RoleListResponse,
  RoleResponse,
} from './response/role.response';
import RoleService from '../service/role.service';
import { ListRequest } from '../../base/controller/request/list.request';
import {
  BaseResponse,
  CreatedUpdatedResponse,
} from '../../base/controller/responses/base.repsonse';
import { CreateUpdateRoleRequest } from './request/role.request';

export const getRoles = async (req: Request, res: Response) => {
  try {
    const response: RoleListResponse = await RoleService.getRoles(
      req.query as unknown as ListRequest
    );
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const getRole = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const response: RoleResponse = await RoleService.getRole(id);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const createRole = async (req: Request, res: Response) => {
  try {
    const response: CreatedUpdatedResponse =
      await RoleService.createRole(
        req.body as unknown as CreateUpdateRoleRequest
      );
    res.status(201).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const response: CreatedUpdatedResponse =
      await RoleService.updateRole(
        req.params.id,
        req.body as unknown as CreateUpdateRoleRequest
      );
    res.status(201).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const softDelete = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const response: BaseResponse = await RoleService.softDelete(id);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};
