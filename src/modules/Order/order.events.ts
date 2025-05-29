import { OrderService } from './order.service';
import { DrizzleClient } from '@database';
import { createProcessor } from '@outbox';

export function registerOrderEvents(orderService: OrderService, db: DrizzleClient) {
    return createProcessor(db, {
      'offer.accepted': async (data)=> {
        console.log('🔥 Event offer.created received');
        await orderService.assignPartnerToOrder(data.orderId, data.partnerId)
      }
    }).start();
}