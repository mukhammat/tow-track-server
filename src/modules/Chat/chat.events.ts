import { eventBus } from '@libs';
import { IChatService } from '.';

export function registerChatEvents(orderService: IChatService) {
  eventBus.on('offer.accepted', async ({ offerId }) => {
    await orderService.createChat(offerId);
  });
}
