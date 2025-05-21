import { DrizzleClient, partners } from '@database';
import { eq } from 'drizzle-orm';

export interface IPartnerService {
  updatePhone(partner_id: string, phone: string): Promise<string>;
}

export class PartnerService implements IPartnerService {
  constructor(private db: DrizzleClient) {}

  public async updatePhone(partner_id: string, phone: string) {
    const partner = await this.db
      .update(partners)
      .set({
        phone,
      })
      .where(eq(partners.id, partner_id))
      .returning({
        id: partners.id,
      });

    return partner[0].id;
  }
}
