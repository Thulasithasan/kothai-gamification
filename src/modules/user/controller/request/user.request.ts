import { z } from 'zod';
const phoneNumberPattern =
  /^(?:0|0094|\+94)?(?:(7)(0|1|2|3|4|5|6|7|8|9)\d)\d{6}$/;

const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: `Email should be a type of 'string'`,
    })
    .nonempty({
      message: 'Email cannot be an empty field ',
    })
    .email({
      message: 'Email should be a valid email',
    }),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: `Password should be a type of 'string'`,
    })
    .regex(
      new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$'),
      {
        message:
          'Password must be at least 8 characters and contain an uppercase letter, lowercase letter, and number',
      }
    )
    .nonempty({
      message: 'Password cannot be an empty field ',
    }),
});

export type LoginRequest = z.infer<typeof loginSchema>;

const resetPasswordSchema = loginSchema.extend({
  otp: z
    .string({
      required_error: 'OTP is required',
      invalid_type_error: `OTP should be a type of 'string'`,
    })
    .max(4, {
      message: 'Maximum length of OTP is 4',
    }),
});

export type ResetPasswordRequest = z.infer<
  typeof resetPasswordSchema
>;

const saveUserSchema = loginSchema.extend({
  firstName: z
    .string({
      required_error: 'FirstName is required',
      invalid_type_error: `FirstName should be a type of 'string'`,
    })
    .max(30, {
      message: `FirstName should have a maximum length of {#limit}`,
    }),
  lastName: z
    .string({
      required_error: 'LastName is required',
      invalid_type_error: `LastName should be a type of 'string'`,
    })
    .max(30, {
      message: `LastName should have a maximum length of {#limit}`,
    }),
  roles: z.array(
    z.string({
      required_error: 'Role is required',
      invalid_type_error: `Role should be a type of 'string'`,
    })
  ).min(1, { message: 'At least one role is required' }),
});

export type SaveUserRequest = z.infer<typeof saveUserSchema>;

const updateUserSchema = z.object({
  id: z.string({
    required_error: 'Name is required',
  }),
  firstName: z
    .string({
      required_error: 'FirstName is required',
      invalid_type_error: `FirstName should be a type of 'string'`,
    })
    .max(30, {
      message: `FirstName should have a maximum length of {#limit}`,
    }),
  lastName: z
    .string({
      required_error: 'LastName is required',
      invalid_type_error: `LastName should be a type of 'string'`,
    })
    .max(30, {
      message: `LastName should have a maximum length of {#limit}`,
    }),
  phoneNumber: z
    .string({
      required_error: 'Phonenumber is required',
      invalid_type_error: `Phonenumber should be a type of 'string'`,
    })
    .regex(phoneNumberPattern, {
      message: `Phone number should have a maximum length of {#limit}`,
    }),
  address1: z.string({
    required_error: 'Address1 is required',
    invalid_type_error: `Address1 should be a type of 'string'`,
  }),
  address2: z.string({
    required_error: 'Address2 is required',
    invalid_type_error: `Address2 should be a type of 'string'`,
  }),
  city: z
    .string({
      required_error: 'City is required',
      invalid_type_error: `City should be a type of 'string'`,
    })
    .max(20, {
      message: `City should have a maximum length of {#limit}`,
    }),
  profileImage: z.string(),
  facebookId: z.string({
    invalid_type_error: `FacebookId should be a type of 'string'`,
  }),
  googleId: z.string({
    invalid_type_error: `GoogleId should be a type of 'string'`,
  }),
  bankDetails: z.array(
    z.object({
      name: z
        .string({
          required_error: 'Name is required',
          invalid_type_error: `Name should be a type of 'string'`,
        })
        .nonempty({
          message: 'Name cannot be an empty field ',
        }),
      branch: z
        .string({
          required_error: 'Branch is required',
          invalid_type_error: `Branch should be a type of 'string'`,
        })
        .nonempty({
          message: 'Branch cannot be an empty field ',
        }),
      accountNo: z
        .string({
          required_error: 'AccountNo is required',
          invalid_type_error: `AccountNo should be a type of 'string'`,
        })
        .nonempty({
          message: 'AccountNo cannot be an empty field ',
        }),
      accountHolderName: z
        .string({
          required_error: 'AccountHolderName is required',
          invalid_type_error: `AccountHolderName should be a type of 'string'`,
        })
        .nonempty({
          message: 'AccountHolderName cannot be an empty field ',
        }),
      isDefault: z.boolean({
        required_error: 'IsDefault is required',
        invalid_type_error: `IsDefault should be a type of 'boolean'`,
      }),
    })
  ),
});
export type UpdateUserRequest = z.infer<typeof updateUserSchema>;

const adminUpdateUserSchema = updateUserSchema.extend({
  isPremiumCustomer: z.boolean(),
  isVerified: z.boolean(),
  isAvailability: z.boolean(),
  isAdvertisementsEnabled: z.boolean(),
  isActive: z.boolean(),
  approvalStatus: z.boolean(),
});
export type AdminUpdateUserRequest = z.infer<
  typeof adminUpdateUserSchema
>;

export default {
  loginSchema,
  resetPasswordSchema,
  saveUserSchema,
  updateUserSchema,
  adminUpdateUserSchema,
};
