import { Router } from 'express';
import {
  getChallenge,
  getChallenges,
  getChallengesByType,
  getLevelChallenges,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  updateChallengeStatus,
} from '../../../controller/challenges.controller';
import { createChallengeSchema } from '../../../controller/request/challenges.request';
import { validateRequest } from '@/middlewares';


const challengesRouter = Router();

challengesRouter.get('/', getChallenges);
challengesRouter.get('/type/:type', getChallengesByType);
challengesRouter.get('/level/:level', getLevelChallenges);
challengesRouter.get('/:id', getChallenge);
challengesRouter.post('/', validateRequest(createChallengeSchema), createChallenge);
challengesRouter.put('/:id', updateChallenge);
challengesRouter.delete('/:id', deleteChallenge);
challengesRouter.put('/:id/status', updateChallengeStatus);

export default challengesRouter;

