import { NotFoundException } from '@src/common/exceptions';
import { OutboxService } from './service';

type EventHandler = (eventData: any) => Promise<void>;
export type EventHandlersMap = Record<string, EventHandler>;


const POLL_INTERVAL_MS = 5000;

export class OutboxProcessor {
  private interval: NodeJS.Timeout | null = null;

  constructor(
    private outboxService: OutboxService,
    private handlers: EventHandlersMap
  ) {}

  start() {
    this.interval = setInterval(() => this.processEvents(), POLL_INTERVAL_MS);
  }

  stop() {
    if (this.interval) clearInterval(this.interval);
  }

  private async processEvents() {
    const events = await this.outboxService.getUnprocessedEvents();

    for (const event of events) {
      try {
        const handler = this.handlers[event.type];
        if (!handler) {
          console.warn(`No handler found for event type: ${event.type}`);
          continue;
        }

        await handler(event.data);
        await this.outboxService.markAsProcessed(event.id);
      } catch (err) {
        console.error(`Error publishing event ${event.id}:`, err);
        await this.outboxService.incrementRetryCount(event.id);
      }
    }
  }
}
