import { Types } from 'mongoose';
import { ChallengeModel, IChallenge, ChallengeType, ActiveStatus } from '../dtos/challenges.dto';

class ChallengeRepository {
  async findById(id: string): Promise<IChallenge | null> {
    return ChallengeModel.findById(id).exec();
  }

  async findAll(filters: {
    type?: ChallengeType;
    activeStatus?: ActiveStatus;
    level?: number;
    page?: number;
    limit?: number;
  }): Promise<{ challenges: IChallenge[]; total: number }> {
    const { type, activeStatus, level, page = 1, limit = 10 } = filters;
    const query: any = {};

    if (type) query.type = type;
    if (activeStatus !== undefined) query.activeStatus = activeStatus;
    if (level) query.level = level;

    const skip = (page - 1) * limit;
    const [challenges, total] = await Promise.all([
      ChallengeModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      ChallengeModel.countDocuments(query)
    ]);

    return { challenges, total };
  }

  async findByType(type: ChallengeType): Promise<IChallenge[]> {
    return ChallengeModel.find({ type, activeStatus: ActiveStatus.ACTIVE })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findCompetitionChallenges(): Promise<IChallenge[]> {
    return ChallengeModel.find({
      type: ChallengeType.COMPETITION,
      activeStatus: ActiveStatus.ACTIVE
    })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findLevelChallenges(level: number): Promise<IChallenge[]> {
    return ChallengeModel.find({
      type: ChallengeType.LEVEL,
      level,
      activeStatus: ActiveStatus.ACTIVE
    })
      .sort({ difficulty: 1 })
      .exec();
  }

  async create(data: {
    title: string;
    description: string;
    type: ChallengeType;
    level?: number;
    content: string;
    timeLimit: number;
    accuracy: number;
    speed: number;
    activeStatus?: ActiveStatus;
  }): Promise<IChallenge> {
    const challenge = new ChallengeModel(data);
    return challenge.save();
  }

  async update(id: string, data: Partial<IChallenge>): Promise<IChallenge | null> {
    return ChallengeModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    ).exec();
  }

  async delete(id: string): Promise<IChallenge | null> {
    return ChallengeModel.findByIdAndDelete(id).exec();
  }

  async updateStatus(id: string, activeStatus: ActiveStatus): Promise<IChallenge | null> {
    return ChallengeModel.findByIdAndUpdate(
      id,
      { $set: { activeStatus } },
      { new: true }
    ).exec();
  }
}

export default new ChallengeRepository();
