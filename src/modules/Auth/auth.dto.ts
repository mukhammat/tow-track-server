import { z } from 'zod';

const PasswordSchema = z
  .string()
  .min(8, { message: 'Password should have minimum length of 8' })
  .max(15, 'Password is too long')
  .regex(/^(?=.*[A-Z]).{8,}$/, {
    message:
      'Should Contain at least one uppercase letter and have a minimum length of 8 characters.',
  });

export const RegisterSchema = z.object({
  firstName: z.string().min(3).max(100),
  lastName: z.string().min(3).max(100),
  iin: z.string().min(10).max(15),
  phone: z.string().min(10).max(15),
  telegramId: z.number(), //.min(5).max(20),
  password: PasswordSchema,
  vehicleInfo: z.string(),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  telegramId: z.number().min(5),
  password: PasswordSchema,
});
