import { eq } from 'drizzle-orm';
import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

export const outbox = table('outbox_events', {
  id: t.uuid('id').primaryKey().defaultRandom(),
  aggregateId: t.uuid('aggregate_id').notNull(),
  type: t.varchar('type', { length: 100 }).notNull(),
  data: t.jsonb('data').notNull(),
  createdAt: t.timestamp('created_at').defaultNow().notNull(),
  processedAt: t.timestamp('processed_at'),
  retryCount: t.integer('retry_count').default(0).notNull(),
  maxRetries: t.integer('max_retries').default(3).notNull(),
}, (table) => ({
  unprocessedIdx: t.index('idx_outbox_unprocessed').on(table.createdAt).where(eq(table.processedAt, null)),
}));