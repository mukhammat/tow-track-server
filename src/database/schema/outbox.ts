import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { isNull } from 'drizzle-orm';

export const outbox = table('outbox', {
  id: t.uuid('id').primaryKey().notNull().defaultRandom(),
  aggregateId: t.uuid('aggregate_id').notNull(),
  type: t.varchar('type').notNull(),
  data: t.jsonb('data').notNull(),
  createdAt: t.timestamp('created_at').defaultNow().notNull(),
  processedAt: t.timestamp('processed_at'),
  retryCount: t.integer('retry_count').default(0).notNull(),
  maxRetries: t.integer('max_retries').default(3).notNull(),
}, (table) => ({
  unprocessedIdx: t.index('idxx_outbox_unprocessed').on(table.createdAt).where(isNull(table.processedAt)),
}));
