import { z } from 'zod';
import {
  AssetBaseType,
  AssetExtType,
} from '../../data/dtos/asset.dto';

const createUpdateAssetSchema = z.object({
  key: z.string({
    required_error: 'Key is required',
    invalid_type_error: 'Key must be a string',
  }),
  base: z.nativeEnum(AssetBaseType, {
    required_error: 'Base type is required',
  }),
  ext: z.nativeEnum(AssetExtType, {
    required_error: 'Extension type is required',
  }),
  isUploaded: z.boolean({
    required_error: 'isUploaded is required',
    invalid_type_error: 'isUploaded must be a boolean',
  }),
  url: z.string().url().optional(),
  isDeleted: z
    .boolean({ invalid_type_error: 'isDeleted must be a boolean' })
    .optional(),
});

type CreateUpdateAssetRequest = z.infer<
  typeof createUpdateAssetSchema
>;

export { type CreateUpdateAssetRequest, createUpdateAssetSchema };
