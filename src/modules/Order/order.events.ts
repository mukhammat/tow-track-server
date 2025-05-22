import { eventBus } from '@libs';
import { OrderService } from './order.service';

// order.events.ts
export function registerOrderEvents(orderService: OrderService) {
  eventBus.on('offer.accepted', async ({ orderId, partnerId }) => {
    await orderService.assignPartnerToOrder(orderId, partnerId); // если метод приватный
  });
}
