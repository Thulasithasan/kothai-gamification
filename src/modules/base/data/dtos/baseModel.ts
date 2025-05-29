import { Document } from 'mongoose';
export interface BaseModel extends Document {
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
