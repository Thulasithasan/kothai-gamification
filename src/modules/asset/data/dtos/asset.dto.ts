import { Schema, model } from 'mongoose';
import { BaseModel } from '../../../base/data/dtos/baseModel';

export enum AssetExtType {
  JPEG = 'jpeg',
  PNG = 'png',
  GIF = 'gif',
  JPG = 'jpg',
  PDF = 'pdf',
  CSV = 'csv',
  XLSX = 'xlsx',
  MP4 = 'mp4',
  MKV = 'mkv',
}

export enum AssetBaseType {
  USER = 'user',
  SP = 'sp',
  OTHER = 'other',
}

export interface AssetModel extends BaseModel {
  key: string;
  base: AssetBaseType;
  ext: AssetExtType;
  isUploaded: boolean;
  url?: string;
}

const AssetSchema = new Schema<AssetModel>(
  {
    key: { type: String, required: true },
    base: {
      type: String,
      enum: Object.values(AssetBaseType),
      required: true,
    },
    ext: {
      type: String,
      enum: Object.values(AssetExtType),
      required: true,
    },
    isUploaded: { type: Boolean, required: true },
    url: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const AssetDTO = model<AssetModel>('Asset', AssetSchema);
