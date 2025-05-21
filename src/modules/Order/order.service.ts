import { eq } from "drizzle-orm";
import { NotFoundException, NotAvailableException } from "@exceptions";
import { CreateOrderDto, GetOrderDto, UpdateOrderDto } from "."
import { DrizzleClient, orders } from "@database";

export interface IOrderService {
    createOrder(data: CreateOrderDto): Promise<string>;
    getAll(): Promise<unknown>;
    cancelOrder(order_id: string): Promise<string>;
    completeOrder(order_id: string): Promise<string>;
    getById(order_id: string): Promise<GetOrderDto>;
}

const 
    ORDER = "Order",
    SEARCH = "searching",
    NEGOTIAT = "negotiating",
    WAIT = "waiting",
    LOAD = "loading",
    DELIVER = "delivered",
    CANCEL = "canceled";

export class OrderService implements IOrderService {
    constructor(private db: DrizzleClient) {
    }

    public async createOrder(data: CreateOrderDto) {
        console.log("Creating order in the database...");
        return (await this.db.insert(orders).values(data).returning())[0].id;
    }

    public async assignPartnerToOrder(order_id: string, partner_id: string) {
        console.log("Assign partner to order...");
        const order = await this.getById(order_id);
    
        if (![NEGOTIAT, SEARCH].includes(order.status)) {
            throw new NotAvailableException(`Order with id - ${order.id}  not available`);
        }
    
        const partnerOrders = await this.getManyByPartnerId(partner_id);
    
        const busyOrder = partnerOrders.find(
            (o) => o.status === WAIT || o.status === LOAD
        );
    
        if (busyOrder) {
            throw new NotAvailableException(`Order with id ${partner_id} already has active order`);
        }
    
        const updatedOrder = await this.updateOrder(order_id, { partner_id, status: NEGOTIAT });
    
        return updatedOrder;
    }

    public async getAll() {
        console.log("Get all orders...");
        const order = await this.db.query.orders.findMany({
            where: eq(orders.status, "searching"),
        });

        if (!order.length) {
            throw new NotFoundException(ORDER);
        }

        return order;
    }

    public async getById(order_id: string) {

        const order = await this.db.query.orders.findFirst({
            where: eq(orders.id, order_id),
        });
    
        if (!order) {
            throw new NotFoundException(ORDER);
        }
    
        return order;
    }
    
    private async getManyByPartnerId(partner_id: string) {
        const results = await this.db.query.orders.findMany({
            where: eq(orders.partner_id, partner_id),
        });

        if (!results.length) {
            throw new NotFoundException(ORDER);
        }

        return results;
    }

    private async updateOrder(order_id: string, data: UpdateOrderDto) {
        console.log("Update order...");
        const order = await this.db
        .update(orders)
        .set(data)
        .where(eq(orders.id,  order_id)).returning();

        return order[0];
    }

    public async cancelOrder(order_id: string) {
        console.log("Cancel order...");
        const order = await this.getById(order_id);
    
        if (order.status === CANCEL) {
            throw new NotAvailableException(`Order with id ${order.id} already has active order`);
        }

        if([DELIVER, WAIT, LOAD, CANCEL].includes(order.status)) {
            throw new NotAvailableException(`Order with id ${order.id} already has active order`);
        }
    
        const updatedOrder = await this.updateOrder(order_id, { status: CANCEL });
    
        return updatedOrder.id;
    }

    public async completeOrder(order_id: string) {
        console.log("Complete order...");
        const order = await this.getById(order_id);
    
        if (order.status === DELIVER) {
            throw new NotAvailableException(`Order with id ${order.id} already has active order`);
        }

            
        if ([SEARCH, NEGOTIAT, CANCEL, DELIVER].includes(order.status)) {
            throw new NotAvailableException(`Order with id ${order.id} already has active order`);
        }
    
        const updatedOrder = await this.updateOrder(order_id, { status: DELIVER });
    
        return updatedOrder.id;
    }
}