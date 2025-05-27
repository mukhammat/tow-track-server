import { DrizzleClient, partners } from '@database';
import { eq } from 'drizzle-orm';

export interface IPartnerService {
  updatePhone(partnerId: string, phone: string): Promise<string>;
}

export class PartnerService implements IPartnerService {
  constructor(private db: DrizzleClient) {}

  public async updatePhone(partnerId: string, phone: string) {
    const partner = await this.db
      .update(partners)
      .set({
        phone,
      })
      .where(eq(partners.id, partnerId))
      .returning({
        id: partners.id,
      });

    return partner[0].id;
  }
}
