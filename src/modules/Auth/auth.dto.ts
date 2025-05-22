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
  first_name: z.string().min(3).max(100),
  last_name: z.string().min(3).max(100),
  iin: z.string().min(10).max(15),
  phone: z.string().min(10).max(15),
  telegram_id: z.number(), //.min(5).max(20),
  password: PasswordSchema,
  vehicle_info: z.string(),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  telegram_id: z.number().min(5).max(20),
  password: PasswordSchema,
});
