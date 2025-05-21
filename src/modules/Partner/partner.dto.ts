import { InferResultType } from '@database';

export type GetPartnerDto = Omit<InferResultType<'partners'>, 'hash'>;
