import ChallengeRepository from '../data/repository/challenges.repository';
import { ChallengeDTO, ChallengeListDTO, CreateChallengeDTO, UpdateChallengeDTO, ChallengeType, ActiveStatus } from '../data/dtos/challenges.dto';

class ChallengeService {
  async getChallengeById(id: string): Promise<ChallengeDTO | null> {
    const challenge = await ChallengeRepository.findById(id);
    return challenge ? new ChallengeDTO(challenge) : null;
  }

  async getChallenges(filters: {
    type?: ChallengeType;
    activeStatus?: ActiveStatus;
    level?: number;
    page?: number;
    limit?: number;
  }): Promise<ChallengeListDTO> {
    const { challenges, total } = await ChallengeRepository.findAll(filters);
    return new ChallengeListDTO(challenges, total);
  }

  async getChallengesByType(type: ChallengeType): Promise<ChallengeDTO[]> {
    const challenges = await ChallengeRepository.findByType(type);
    return challenges.map(challenge => new ChallengeDTO(challenge));
  }

  async getCompetitionChallenges(): Promise<ChallengeDTO[]> {
    const challenges = await ChallengeRepository.findCompetitionChallenges();
    return challenges.map(challenge => new ChallengeDTO(challenge));
  }

  async getLevelChallenges(level: number): Promise<ChallengeDTO[]> {
    const challenges = await ChallengeRepository.findLevelChallenges(level);
    return challenges.map(challenge => new ChallengeDTO(challenge));
  }

  async createChallenge(data: CreateChallengeDTO): Promise<ChallengeDTO> {
    // Validate challenge type specific requirements
    if (data.type === ChallengeType.LEVEL && !data.level) {
      throw new Error('Level is required for level-based challenges');
    }

    // Validate performance metrics
    if (data.accuracy < 0 || data.accuracy > 100) {
      throw new Error('Accuracy must be between 0 and 100');
    }
    if (data.speed < 0) {
      throw new Error('Speed must be greater than or equal to 0');
    }
    if (data.timeLimit < 0) {
      throw new Error('Time limit must be greater than or equal to 0');
    }

    const challenge = await ChallengeRepository.create({
      title: data.title,
      description: data.description,
      type: data.type,
      level: data.level,
      content: data.content,
      timeLimit: data.timeLimit,
      accuracy: data.accuracy,
      speed: data.speed,
      activeStatus: data.activeStatus ?? ActiveStatus.ACTIVE
    });
    return new ChallengeDTO(challenge);
  }

  async updateChallenge(id: string, data: UpdateChallengeDTO): Promise<ChallengeDTO | null> {
    // Validate performance metrics if provided
    if (data.accuracy !== undefined && (data.accuracy < 0 || data.accuracy > 100)) {
      throw new Error('Accuracy must be between 0 and 100');
    }
    if (data.speed !== undefined && data.speed < 0) {
      throw new Error('Speed must be greater than or equal to 0');
    }
    if (data.timeLimit !== undefined && data.timeLimit < 0) {
      throw new Error('Time limit must be greater than or equal to 0');
    }

    const challenge = await ChallengeRepository.update(id, data);
    return challenge ? new ChallengeDTO(challenge) : null;
  }

  async deleteChallenge(id: string): Promise<ChallengeDTO | null> {
    const challenge = await ChallengeRepository.delete(id);
    return challenge ? new ChallengeDTO(challenge) : null;
  }

  async updateChallengeStatus(id: string, activeStatus: ActiveStatus): Promise<ChallengeDTO | null> {
    const challenge = await ChallengeRepository.updateStatus(id, activeStatus);
    return challenge ? new ChallengeDTO(challenge) : null;
  }
}

export default new ChallengeService();
