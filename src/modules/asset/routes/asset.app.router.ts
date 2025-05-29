import { Router } from 'express';
import {
  getAssets,
  getAsset,
  createAsset,
  updateAsset,
  softDelete,
} from '../controller/asset.controller';
import zodValidator from '@/src/middlewares/validator';
import { createUpdateAssetSchema } from '../controller/request/asset.request';

const assetRouter: Router = Router();

assetRouter.get('/', getAssets);
assetRouter.get('/:id', getAsset);
assetRouter.post(
  '/',
  zodValidator(createUpdateAssetSchema),
  createAsset
);
assetRouter.put(
  '/:id',
  zodValidator(createUpdateAssetSchema),
  updateAsset
);
assetRouter.delete('/:id', softDelete);

export default assetRouter;
