import { InferResultType } from '@database';

export type GetMesssageType = InferResultType<'messages'>;
export type CreateMessageDto = Omit<GetMesssageType, 'id' | 'created_at'>;

export type UpdateMessageDto = Partial<CreateMessageDto>;
