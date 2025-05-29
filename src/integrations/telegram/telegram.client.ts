// src/events/offer-events.ts
import { createProcessor } from "@outbox";
import db from '@src/database';

type Data = {
  price: number;
  orderId: string;
  partnerId: string;
  createdAt: Date;
  chatId: number;
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
    return createProcessor(db, {
    'offer.created': async (data)=> {
      console.log('🔥 Event offer.created received');
      await notifyNewOffer(data);
    }
  }).start();
}