import { DrizzleClient } from "@database";
import { OrderController, OrderService, registerOrderEvents } from ".";
import { OrderRouter } from "./order.router";


export const createOrder = (db: DrizzleClient) => {
    const orderSrv = new OrderService(db);
    registerOrderEvents(orderSrv);
    const cntrlr =  new OrderController(orderSrv);
    return new OrderRouter(cntrlr).router;
}