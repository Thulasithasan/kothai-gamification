import { Document, Schema, model, Types } from 'mongoose';

export enum ChallengeType {
  COMPETITION = 'COMPETITION',
  DAILY = 'DAILY',
  LEVEL = 'LEVEL'
}

export enum ActiveStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface IChallenge extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  type: ChallengeType;
  level?: number;  // Required for LEVEL type challenges
  content: string; // The actual challenge content
  timeLimit: number;
  accuracy: number;
  speed: number;
  activeStatus: ActiveStatus; 
  createdAt: Date;
  updatedAt: Date;
}

const ChallengeSchema = new Schema<IChallenge>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: Object.values(ChallengeType),
      required: true
    },
    level: {
      type: Number,
      required: function(this: IChallenge) {
        return this.type === ChallengeType.LEVEL;
      },
      min: 1
    },
    content: {
      type: String,
      required: true
    },
    timeLimit: {
      type: Number,
      required: true,
      min: 0
    },
    accuracy: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    speed: {
      type: Number,
      required: true,
      min: 0
    },
    activeStatus: {
      type: String,
      enum: Object.values(ActiveStatus),
      default: ActiveStatus.ACTIVE
    }
  },
  { timestamps: true }
);

// Indexes
ChallengeSchema.index({ type: 1, level: 1 }, { unique: true, sparse: true });
ChallengeSchema.index({ type: 1, startDate: 1, endDate: 1 });

export const ChallengeModel = model<IChallenge>('Challenge', ChallengeSchema);

export class ChallengeDTO {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  level?: number;
  content: string;
  timeLimit: number;
  accuracy: number;
  speed: number;
  activeStatus: ActiveStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(challenge: IChallenge) {
    this.id = challenge._id.toString();
    this.title = challenge.title;
    this.description = challenge.description;
    this.type = challenge.type;
    this.level = challenge.level;
    this.content = challenge.content;
    this.timeLimit = challenge.timeLimit;
    this.accuracy = challenge.accuracy;
    this.speed = challenge.speed;
    this.activeStatus = challenge.activeStatus;
    this.createdAt = challenge.createdAt;
    this.updatedAt = challenge.updatedAt;
  }
}

export class CreateChallengeDTO {
  title!: string;
  description!: string;
  type!: ChallengeType;
  level?: number;
  content!: string;
  timeLimit!: number;
  accuracy!: number;
  speed!: number;
  activeStatus?: ActiveStatus;
}

export class UpdateChallengeDTO {
  title?: string;
  description?: string;
  content?: string;
  timeLimit?: number;
  accuracy?: number;
  speed?: number;
  activeStatus?: ActiveStatus;
}

export class ChallengeListDTO {
  challenges: ChallengeDTO[];
  total: number;

  constructor(challenges: IChallenge[], total: number) {
    this.challenges = challenges.map(challenge => new ChallengeDTO(challenge));
    this.total = total;
  }
}
