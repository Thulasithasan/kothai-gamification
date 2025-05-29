import { AssetDTO, AssetModel } from '../dtos/asset.dto';

function findByKey(key: string): Promise<AssetModel | null> {
  return AssetDTO.findOne({ key, isDeleted: false });
}

export default {
  findByKey,
};
