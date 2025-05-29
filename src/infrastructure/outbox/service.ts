import { DrizzleClient, outbox, TransactionType } from '@database';
import { eq, isNull, lt, asc, and, gte, sql } from 'drizzle-orm';

export class OutboxService {
  constructor(private db: DrizzleClient) {}
  
  public async saveEvent(type: string, aggregateId: string, data: unknown, tx: TransactionType | null = null) {
    const db = tx || this.db
    const [event] = await db
      .insert(outbox)
      .values({
        type,
        aggregateId,
        data,
      })
      .returning({ id: outbox.id });
    
    return event.id;
  }

  static async saveEventTx(type: string, aggregateId: string, data: unknown, tx: TransactionType) {
    const [event] = await tx
      .insert(outbox)
      .values({
        type,
        aggregateId,
        data,
      })
      .returning({ id: outbox.id });
    
    return event.id;
  }

  public async getUnprocessedEvents(limit: number = 100) {
    return await this.db
      .select()
      .from(outbox)
      .where(
        and(
          isNull(outbox.processedAt),
          lt(outbox.retryCount, outbox.maxRetries)
        )
      )
      .orderBy(asc(outbox.createdAt))
      .limit(limit);
  }

  public async markAsProcessed(eventId: string) {
    await this.db
      .update(outbox)
      .set({ processedAt: new Date() })
      .where(eq(outbox.id, eventId));
  }

  public async incrementRetryCount(eventId: string) {
    await this.db
      .update(outbox)
      .set({ 
        retryCount: sql`${outbox.retryCount} + 1` 
      })
      .where(eq(outbox.id, eventId));
  }

  public async getFailedEvents() {
    return await this.db
      .select()
      .from(outbox)
      .where(
        and(
          isNull(outbox.processedAt),
          gte(outbox.retryCount, outbox.maxRetries)
        )
      );
  }
}