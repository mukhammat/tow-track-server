import { DrizzleClient } from '@database';
import { OfferService } from './offer.service';
import { OfferController } from './offer.controller';
import { OfferRouter } from './offer.router';

export const createOffer = (db: DrizzleClient) => {
  const offerSrv = new OfferService(db);
  const cntrlr = new OfferController(offerSrv);
  return new OfferRouter(cntrlr).router;
};
