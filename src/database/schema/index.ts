import { pgEnum, pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

export * from "./outbox"

// Партнёры
export const partners = table('partners', {
  id: t.uuid().primaryKey().notNull().defaultRandom(),
  firstName: t.varchar('first_name').notNull(),
  lastName: t.varchar('last_name').notNull(),
  iin: t.varchar('iin').notNull().unique(),
  phone: t.varchar('phone').notNull().unique(),
  telegramId: t.integer('telegram_id').notNull().unique(),
  hash: t.varchar('hash').notNull(),
  vehicleInfo: t.text('vehicle_info').notNull(),
  createdAt: t.timestamp('created_at').defaultNow(),
  updatedAt: t.timestamp('updated_at'),
});

export const OrderStatusEnum = pgEnum('order_status_enum', [
  'searching', // Посик эвакуатора
  'negotiating', // Переговоры с водителем
  'waiting', // Ожидание водителя
  'loading', // Загрузка автомобиля
  'delivered', // Автомобиль эвакуирован
  'canceled', // Заказ отменён
]);

export const orders = table('orders', {
  id: t.uuid().primaryKey().notNull().defaultRandom(),
  from: t.varchar('from').notNull(),
  to: t.varchar('to').notNull(),
  intercity: t.integer('is_intercity').notNull().default(0),
  locationUrl: t.varchar('location_url'),
  phone: t.varchar('phone'),
  clientTelegramId: t.integer('client_telegram_id'),
  vehicleInfo: t.text('vehicle_info').notNull(),
  partnerId: t.uuid('partner_id').references(() => partners.id, { onDelete: 'cascade' }),
  price: t.real('price'),
  status: OrderStatusEnum().notNull().default('searching'),
  createdAt: t.timestamp('created_at').defaultNow(),
  updatedAt: t.timestamp('updated_at'),
});

export const OfferStatusEnum = pgEnum('offer_status_enum', [
  'pending', // Ожидание решения клиента
  'accepted', // Клиент принял оффер
  'rejected', // Клиент отказал
]);

export const offers = table(
  'offers',
  {
    id: t.uuid().primaryKey().notNull().defaultRandom(),
    orderId: t
      .uuid('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    partnerId: t
      .uuid('partner_id')
      .notNull()
      .references(() => partners.id, { onDelete: 'cascade' }),
    price: t.real('price').notNull(),
    status: OfferStatusEnum().notNull().default('pending'),
    createdAt: t.timestamp('created_at').defaultNow(),
    updatedAt: t.timestamp('updated_at'),
  },
  (offers) => ({
    uniqueOrderPartner: t
      .uniqueIndex('unique_order_partner')
      .on(offers.orderId, offers.partnerId),
  }),
);

// Чаты
export const chats = table('chats', {
  id: t.uuid().primaryKey().notNull().defaultRandom(),
  offerId: t
    .uuid('offer_id')
    .notNull()
    .unique()
    .references(() => offers.id, { onDelete: 'cascade' }),
  createdAt: t.timestamp('created_at').defaultNow(),
});

// Сообщения в чате
export const messages = table('messages', {
  id: t.uuid().primaryKey().notNull().defaultRandom(),
  chatId: t
    .uuid('chat_id')
    .notNull()
    .references(() => chats.id, { onDelete: 'cascade' }),
  message: t.text('message').notNull(),
  isClient: t.integer('is_client').notNull().default(0),
  createdAt: t.timestamp('created_at').defaultNow(),
});
