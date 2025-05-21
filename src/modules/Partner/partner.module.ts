import { DrizzleClient } from '@database';
import { PartnerController, PartnerRouter, PartnerService } from '.';

export const createPartner = (db: DrizzleClient) => {
  const service = new PartnerService(db);
  const controller = new PartnerController(service);
  return new PartnerRouter(controller).router;
};
