import { Schema, model } from 'mongoose';
import { BaseModel } from '../../../base/data/dtos/baseModel';
import { RoleTypeEnum } from '@/modules/user/enums/role';

export interface RoleModel extends BaseModel {
  name: string;
  type: RoleTypeEnum;
  description?: string;
}

const RoleSchema = new Schema<RoleModel>(
  {
    name: { type: String, unique: true, required: true },
    type: { type: String, enum: RoleTypeEnum, required: true },
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const RoleDTO = model<RoleModel>('Role', RoleSchema);
