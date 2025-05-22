import { z } from 'zod';
import { InferResultType } from '@database';
import { UUIDSchema } from '@dto';

export type GetOfferDto = InferResultType<'offers'>;

export type OfferStatus = GetOfferDto['status'];

export type UpdateStatusDto = Exclude<OfferStatus, 'pending'>;

export type UpdateOfferDto = Partial<GetOfferDto>;

export const CreateOfferSchema = z.object({
  order_id: UUIDSchema,
  partner_id: UUIDSchema,
  price: z.number().positive(),
});

export type CreateOfferDto = z.infer<typeof CreateOfferSchema>;
