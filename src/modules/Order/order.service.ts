import { eq } from 'drizzle-orm';
import { NotFoundException, NotAvailableException } from '@exceptions';
import { CreateOrderDto, GetOrderDto, UpdateOrderDto } from '.';
import { DrizzleClient, orders, TransactionType } from '@database';

export interface IOrderService {
  getAll(): Promise<GetOrderDto[]>;
  createOrder(data: CreateOrderDto): Promise<string>;
  getById(order_id: string): Promise<GetOrderDto>;
  cancelOrder(order_id: string): Promise<string>;
  completeOrder(order_id: string): Promise<string>;
}

const ORDER = 'Order',
  SEARCH = 'searching',
  NEGOTIAT = 'negotiating',
  WAIT = 'waiting',
  LOAD = 'loading',
  DELIVER = 'delivered',
  CANCEL = 'canceled';

export class OrderService implements IOrderService {
  constructor(private db: DrizzleClient) {}

  public async getAll() {
    console.log('Get all orders...');
    const order = await this.db.query.orders.findMany({
      where: eq(orders.status, 'searching'),
    });

    if (!order.length) {
      throw new NotFoundException(ORDER);
    }

    return order;
  }

  public async createOrder(data: CreateOrderDto) {
    console.log('Creating order in the database...');
    return (await this.db.insert(orders).values(data).returning())[0].id;
  }

  public async getById(order_id: string, tx?: TransactionType) {
    const db = tx ? tx : this.db;

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, order_id),
    });

    if (!order) {
      throw new NotFoundException(`Order with partner_id: ${order_id} not found`);
    }

    return order;
  }

  public async cancelOrder(order_id: string) {
    console.log('Cancel order...');
    return this.db.transaction(async (tx) => {
      const order = await this.getById(order_id, tx);

      if (order.status === CANCEL) {
        throw new NotAvailableException(`Order with id ${order.id} already has active order`);
      }

      if ([DELIVER, WAIT, LOAD, CANCEL].includes(order.status)) {
        throw new NotAvailableException(`Order with id ${order.id} already has active order`);
      }

      const updatedOrder = await this.updateOrder({ order_id, data: { status: CANCEL }, tx });

      return updatedOrder.id;
    });
  }

  public async completeOrder(order_id: string) {
    console.log('Complete order...');
    return this.db.transaction(async (tx) => {
      const order = await this.getById(order_id, tx);

      if (order.status === DELIVER) {
        throw new NotAvailableException(`Order with id ${order.id} already has active order`);
      }

      if ([SEARCH, NEGOTIAT, CANCEL, DELIVER].includes(order.status)) {
        throw new NotAvailableException(`Order with id ${order.id} already has active order`);
      }

      const updatedOrder = await this.updateOrder({ order_id, data: { status: DELIVER }, tx });

      return updatedOrder.id;
    });
  }

  public async assignPartnerToOrder(order_id: string, partner_id: string): Promise<GetOrderDto> {
    try {
      console.log('Assign partner to order...');
      return this.db.transaction(async (tx) => {
        const order = await this.getById(order_id, tx);

        if (![NEGOTIAT, SEARCH].includes(order.status)) {
          throw new NotAvailableException(`Order with id - ${order.id}  not available`);
        }

        const partnerOrders = await this.getManyByPartnerId(partner_id, tx);

        if(partnerOrders) {
          const busyOrder = partnerOrders.find((o) => o.status === WAIT || o.status === LOAD);
          if (busyOrder) {
            throw new NotAvailableException(`Order with id ${partner_id} already has active order`);
          }
        }

        const updatedOrder = await this.updateOrder({
          order_id,
          data: {
            partner_id,
            status: NEGOTIAT,
          },
          tx,
        });

        return updatedOrder;
      });
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  }

  private async getManyByPartnerId(
    partner_id: string,
    tx?: TransactionType,
  ): Promise<GetOrderDto[] | false> {
    const db = tx ? tx : this.db;
    const results = await db.query.orders.findMany({
      where: eq(orders.partner_id, partner_id),
    });

    return results.length ? results : false;
  }

  private async updateOrder({ order_id, data, tx }: UpdateOrderDto): Promise<GetOrderDto> {
    const db = tx ? tx : this.db;

    console.log('Update order...');
    const order = await db.update(orders).set(data).where(eq(orders.id, order_id)).returning();

    return order[0];
  }
}
