import { DrizzleClient } from '@src/database';
import { IChatService } from '.';
import { createProcessor } from '@outbox';

export function registerChatEvents(orderService: IChatService, db: DrizzleClient) {
  return createProcessor(db, {
    'offer.accepted': async (data)=> {
      console.log('🔥 Event offer.accepted received');
      await orderService.createChat(data.offerId);
    }
  }).start();
}
