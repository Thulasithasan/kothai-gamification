import { z } from "zod";
import { ActiveStatus, ChallengeType } from "../../data/dtos/challenges.dto";

const baseChallengeSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title should be a type of string",
    })
    .nonempty({
      message: "Title cannot be an empty field",
    })
    .max(100, {
      message: "Title should have a maximum length of 100",
    }),
  description: z
    .string({
      required_error: "Description is required",
      invalid_type_error: "Description should be a type of string",
    })
    .nonempty({
      message: "Description cannot be an empty field",
    })
    .max(500, {
      message: "Description should have a maximum length of 500",
    }),
  content: z
    .string({
      required_error: "Content is required",
      invalid_type_error: "Content should be a type of string",
    })
    .nonempty({
      message: "Content cannot be an empty field",
    }),
  timeLimit: z
    .number({
      required_error: "Time limit is required",
      invalid_type_error: "Time limit should be a type of number",
    })
    .min(0, {
      message: "Time limit must be greater than or equal to 0",
    }),
  accuracy: z
    .number({
      required_error: "Accuracy is required",
      invalid_type_error: "Accuracy should be a type of number",
    })
    .min(0, {
      message: "Accuracy must be greater than or equal to 0",
    })
    .max(100, {
      message: "Accuracy must be less than or equal to 100",
    }),
  speed: z
    .number({
      required_error: "Speed is required",
      invalid_type_error: "Speed should be a type of number",
    })
    .min(0, {
      message: "Speed must be greater than or equal to 0",
    }),
});

export const createChallengeSchema = baseChallengeSchema.extend({
  type: z.nativeEnum(ChallengeType, {
    required_error: "Type is required",
    invalid_type_error: "Type must be a valid challenge type",
  }),
  activeStatus: z.nativeEnum(ActiveStatus, {
    required_error: "Active status is required",
    invalid_type_error: "Active status must be a valid status",
  }),
  level: z.number().min(1).optional(),
}).superRefine((data, ctx) => {
  if (data.type === ChallengeType.LEVEL && data.level === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "`level` is required when type is LEVEL",
      path: ["level"],
    });
  }
});


export const updateChallengeSchema = baseChallengeSchema.partial().extend({
  activeStatus: z.nativeEnum(ActiveStatus, {
    required_error: "Active status is required",
    invalid_type_error: "Active status must be a valid status",
  }),
});

export const challengeIdSchema = z.object({
  id: z
    .string({
      required_error: "Challenge ID is required",
      invalid_type_error: "Challenge ID should be a type of string",
    })
    .nonempty({
      message: "Challenge ID cannot be an empty field",
    }),
});

export const challengeTypeSchema = z.object({
  type: z.nativeEnum(ChallengeType, {
    required_error: "Type is required",
    invalid_type_error: "Type must be a valid challenge type",
  }),
});

export const challengeLevelSchema = z.object({
  level: z
    .number({
      required_error: "Level is required",
      invalid_type_error: "Level should be a type of number",
    })
    .min(1, {
      message: "Level must be greater than 0",
    }),
});

export const challengeListSchema = z.object({
  type: z.nativeEnum(ChallengeType).optional(),
  activeStatus: z.nativeEnum(ActiveStatus).optional(),
  level: z.number().min(1).optional(),
  page: z.number().min(1).max(100).default(1),
  limit: z.number().min(1).max(50).default(10),
});

// Export types
export type CreateChallengeRequest = z.infer<typeof createChallengeSchema>;
export type UpdateChallengeRequest = z.infer<typeof updateChallengeSchema>;
export type ChallengeIdRequest = z.infer<typeof challengeIdSchema>;
export type ChallengeTypeRequest = z.infer<typeof challengeTypeSchema>;
export type ChallengeLevelRequest = z.infer<typeof challengeLevelSchema>;
export type ChallengeListRequest = z.infer<typeof challengeListSchema>;

export default {
  createChallengeSchema,
  updateChallengeSchema,
  challengeIdSchema,
  challengeTypeSchema,
  challengeLevelSchema,
  challengeListSchema,
};
