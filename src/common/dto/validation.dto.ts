import { z } from 'zod';

export const UUIDSchema = z.string().uuid('ID заказа должен быть положительным числом');