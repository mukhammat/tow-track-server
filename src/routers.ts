import { Router } from 'express';
import { DrizzleClient } from '@database';
import { createAuth } from '@modules/Auth';
import { createPartner } from '@modules/Partner';
import { createOrder } from '@modules/Order';
import { createOffer } from '@modules/Offer';
import { createChat } from '@modules/Chat';

export const routers = (db: DrizzleClient): Router => {
  const router = Router();

  router
  .use('/auth', createAuth(db))
  .use('/partner', createPartner(db))
  .use('/order', createOrder(db))
  .use('/offer', createOffer(db))
  .use('/message', createChat(db))

  return router;
};
