import { eq } from "drizzle-orm";
import { CreateOfferDto, GetOfferDto, OfferStatus, UpdateOfferDto, UpdateStatusDto } from "."
import { BadRequestException, NotFoundException } from "@exceptions";
import { eventBus } from "@libs";
import { DrizzleClient, offers } from "@database";

export interface IOfferService {
  createOffer(data: CreateOfferDto):Promise<string>;
  getAll(): Promise<GetOfferDto[]>;
  acceptOffer( offerId: string): Promise<GetOfferDto>;
  getPendingOffersByOrderId( orderId: string): Promise<GetOfferDto[]>;
  cancelOffer( offerId: string): Promise<GetOfferDto>;
}

export class OfferService implements IOfferService {
  constructor(private db: DrizzleClient) {}

  public async createOffer(data: CreateOfferDto) {
      return (await this.db.insert(offers).values(data).returning())[0].id;
  }

  public async getAll() {
      const allOffers = await this.db.query.offers.findMany({
          where: eq(offers.status, "pending"),
      });

      if(!allOffers.length) {
          throw new NotFoundException("Offer")
      }

      return allOffers;
  }

  public async acceptOffer(offerId: string) {
      const offer = await this.updateOfferStatus( offerId, "accepted");

      eventBus.emit("offer.accepted", {
        offerId,
        orderId: offer.order_id,
        partnerId: offer.partner_id,
      });
      return offer;
  }

  private async updateOfferStatus(
    offerId: string,
    status: UpdateStatusDto,
  ): Promise<GetOfferDto> {
    return this.db.transaction(async (tx)=> {
      const offer = await tx.query.offers.findFirst({
        where: eq(offers.id, offerId),
      });

      if (!offer) {
        throw new NotFoundException("Offer");
      }

      // 2. Проверить, что его ещё можно менять
      if (["accepted", "rejected"].includes(offer.status)) {
        throw new BadRequestException(`Offer #${offerId} has already been ${offer.status}.`);
      }

      const update = await tx
      .update(offers)
      .set({
        status
      })
      .where(eq(offers.id, offerId)).returning();


      return update[0];
    })
  }

  public async getPendingOffersByOrderId( orderId: string) {
      const offersByOrderId = await this.db.query.offers.findMany({
          where: eq(offers.order_id, orderId) && eq(offers.status, "pending"),
      });

      if(!offersByOrderId.length) {
          throw new NotFoundException("Offer")
      }

      return offersByOrderId;
  }

  public async cancelOffer(offerId: string) {
    const offer = await this.updateOfferStatus(offerId, "rejected");
    return offer;
  }
}