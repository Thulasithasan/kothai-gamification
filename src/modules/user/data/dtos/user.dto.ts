import mongoose, { ObjectId, Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { BaseModel } from '../../../base/data/dtos/baseModel';
import { RoleModel } from './role.dto';

export interface UserModel extends BaseModel {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: Array<RoleModel | ObjectId>;
  address1?: string;
  address2?: string;
  city?: string;
  phoneNumber?: string;
  otp?: string;
  otpExpiresAt?: Date;
  facebookId?: string;
  googleId?: string;
  profileImage?: string;
  isVerified?: boolean;
  isPremiumCustomer?: boolean;
  isAvailability?: boolean;
  isAdvertisementsEnabled?: boolean;
  isActive?: boolean;
  approvalStatus?: boolean;
  bankDetails?: Array<BankDetail>;
  refreshTokens?: Array<{
    token: string;
    expiresAt: Date;
  }>;
}

export interface BankDetail {
  name: string;
  branch: string;
  accountNo: string;
  accountHolderName: string;
  isDefault: boolean;
}

const UserSchema = new Schema<UserModel>(
  {
    //Role
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
        index: 1,
      },
    ],
    //Asset
    profileImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      index: 1,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match:
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    password: { type: String, required: true },
    address1: { type: String },
    address2: { type: String },
    facebookId: { type: String },
    googleId: { type: String },
    phoneNumber: { type: String },
    city: { type: String },
    otp: { type: String },
    otpExpiresAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
    isPremiumCustomer: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isAvailability: { type: Boolean, default: false },
    isAdvertisementsEnabled: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    approvalStatus: { type: Boolean, default: false },
    bankDetails: [
      {
        name: { type: String, required: true },
        branch: { type: String, required: true },
        accountNo: { type: String, required: true },
        accountHolderName: { type: String, required: true },
        isDefault: { type: Boolean, required: true, default: false },
      },
    ],
    refreshTokens: [{
      token: { type: String },
      expiresAt: { type: Date }
    }]
  },
  { timestamps: true }
);

//setup the pre hook, so everytime we create or update the user with password field with new value, it's gonna encrypt the password.
UserSchema.pre(['save'], async function (next) {
  if (this.isModified('password') && this.password != null) {
    //salt rounds = 8
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export const UserDTO = model<UserModel>('User', UserSchema);
