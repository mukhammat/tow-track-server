import { InferResultType, TransactionType } from '@database';
import { UUIDSchema } from '@dto';

export type GetOrderDto = InferResultType<'orders'>;

export type OrderStatus = GetOrderDto['status'];

export type UpdateOrderDto = {
  orderId: string;
  data: Partial<GetOrderDto>;
  tx?: TransactionType;
};

export type CreateOrderDto = Omit<
  GetOrderDto,
  'id' | 'createdAt' | 'partnerId' | 'price' | 'status' | 'updatedAt'
>;

import { z } from 'zod';

const OrderStatusEnum = z.enum([
  'searching', // Посик эвакуатора
  'negotiating', // Переговоры с водителем
  'waiting', // Ожидание водителя
  'loading', // Загрузка автомобиля
  'delivered', // Автомобиль эвакуирован
  'canceled', // Заказ отменён
]);

export const CreateOrderSchema = z
  .object({
    from: z.string().min(1, 'откуда обязателен'),
    to: z.string().min(1, 'куда обязателен'),
    intercity: z.boolean().default(false),
    locationUrl: z.string().url().optional(),
    phone: z.string().min(5, 'некорректный телефон'),
    clientTelegramId: z.number(),
    vehicleInfo: z.string().min(3, 'укажи информацию о транспорте'),
    partnerId: z.number().int().nullable().optional(),
    price: z.number().nonnegative().nullable().optional(),
    status: OrderStatusEnum.optional().default('searching'), // по умолчанию - searching
  })
  .strict();
