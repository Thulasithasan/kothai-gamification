import { Request, Response } from 'express';
import ChallengesService from '../service/challenges.service';
import { CreateChallengeDTO, UpdateChallengeDTO, ChallengeType, ActiveStatus } from '../data/dtos/challenges.dto';
import { BaseResponse, CreatedUpdatedResponse } from '../../base/controller/responses/base.repsonse';

export const getChallenge = async (req: Request, res: Response): Promise<void> => {
  const challenge = await ChallengesService.getChallengeById(req.params.id);
  if (!challenge) {
    res.status(404).json({ status: false, message: 'Challenge not found' } as BaseResponse);
    return;
  }
  res.json({ status: true, challenge } as BaseResponse);
};

export const getChallenges = async (req: Request, res: Response): Promise<void> => {
  const filters = {
    type: req.query.type as ChallengeType | undefined,
    activeStatus: req.query.activeStatus as ActiveStatus | undefined,
    level: req.query.level ? parseInt(req.query.level as string) : undefined,
    page: req.query.page ? parseInt(req.query.page as string) : 1,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 10
  };

  const challenges = await ChallengesService.getChallenges(filters);
  res.json({ status: true, ...challenges } as BaseResponse);
};

export const getChallengesByType = async (req: Request, res: Response): Promise<void> => {
  const type = req.params.type as ChallengeType;
  if (!Object.values(ChallengeType).includes(type)) {
    res.status(400).json({ status: false, message: 'Invalid challenge type' } as BaseResponse);
    return;
  }

  const challenges = await ChallengesService.getChallengesByType(type);
  res.json({ status: true, challenges } as BaseResponse);
};

export const getCompetitionChallenges = async (req: Request, res: Response): Promise<void> => {
  const challenges = await ChallengesService.getCompetitionChallenges();
  res.json({ status: true, challenges } as BaseResponse);
};

export const getLevelChallenges = async (req: Request, res: Response): Promise<void> => {
  const level = parseInt(req.params.level);
  if (isNaN(level) || level < 1) {
    res.status(400).json({ status: false, message: 'Invalid level number' } as BaseResponse);
    return;
  }

  const challenges = await ChallengesService.getLevelChallenges(level);
  res.json({ status: true, challenges } as BaseResponse);
};

export const createChallenge = async (req: Request, res: Response): Promise<void> => {
  const challengeData: CreateChallengeDTO = {
    title: req.body.title,
    description: req.body.description,
    type: req.body.type,
    level: req.body.level,
    content: req.body.content,
    timeLimit: req.body.timeLimit,
    accuracy: req.body.accuracy,
    speed: req.body.speed,
    activeStatus: req.body.activeStatus
  };
  console.log("challengeData", challengeData);

  try {
    const challenge = await ChallengesService.createChallenge(challengeData);
    res.status(201).json({ status: true, id: challenge.id } as CreatedUpdatedResponse);
  } catch (error: any) {
    res.status(400).json({ status: false, message: error.message } as BaseResponse);
  }
};

export const updateChallenge = async (req: Request, res: Response): Promise<void> => {
  const challengeData: UpdateChallengeDTO = {
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    timeLimit: req.body.timeLimit,
    accuracy: req.body.accuracy,
    speed: req.body.speed,
    activeStatus: req.body.activeStatus
  };

  try {
    const challenge = await ChallengesService.updateChallenge(req.params.id, challengeData);
    if (!challenge) {
      res.status(404).json({ status: false, message: 'Challenge not found' } as BaseResponse);
      return;
    }
    res.json({ status: true, id: challenge.id } as CreatedUpdatedResponse);
  } catch (error: any) {
    res.status(400).json({ status: false, message: error.message } as BaseResponse);
  }
};

export const deleteChallenge = async (req: Request, res: Response): Promise<void> => {
  const challenge = await ChallengesService.deleteChallenge(req.params.id);
  if (!challenge) {
    res.status(404).json({ status: false, message: 'Challenge not found' } as BaseResponse);
    return;
  }
  res.json({ status: true, message: 'Challenge deleted successfully' } as BaseResponse);
};

export const updateChallengeStatus = async (req: Request, res: Response): Promise<void> => {
  const challenge = await ChallengesService.updateChallengeStatus(req.params.id, req.body.activeStatus);
  if (!challenge) {
    res.status(404).json({ status: false, message: 'Challenge not found' } as BaseResponse);
    return;
  }
  res.json({ status: true, message: 'Challenge status updated successfully' } as BaseResponse);
};
