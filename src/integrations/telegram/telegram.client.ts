// src/events/offer-events.ts
import { eventBus } from '@libs';

type Data = {
  price: number;
  order_id: string;
  partner_id: string;
  created_at: Date;
  chat_id: number;
};

async function notifyNewOffer(data: Data) {
  console.log('notifyNewOffer');
  await fetch(`${process.env.TELEGRAM_WEBHOOK_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export function registerOfferEvents() {
  eventBus.on('offer.created', async (data: Data) => {
    try {
      console.log('🔥 Event offer.created received');
      await notifyNewOffer(data);
    } catch (error) {
      console.error('❌ Ошибка в notifyNewOffer', error);
    }
  });
}
