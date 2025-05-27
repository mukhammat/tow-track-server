import { InferResultType } from '@database';

export type GetMesssageType = InferResultType<'messages'>;
export type CreateMessageDto = Omit<GetMesssageType, 'id' | 'createdAt'>;

export type UpdateMessageDto = Partial<CreateMessageDto>;
