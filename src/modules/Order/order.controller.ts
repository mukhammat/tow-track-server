import { NextFunction, Request, Response } from 'express';
import { IOrderService } from '.';
import { ControllerMethod } from '@src/common/dto';

export interface IOrderController {
  createOrder: ControllerMethod;
  getAll: ControllerMethod;
  cancelOrder: ControllerMethod;
  completeOrder: ControllerMethod;
  getById: ControllerMethod;
}

export class OrderController implements IOrderController {
  constructor(private orderService: IOrderService) {}
  public async createOrder(req: Request, res: Response) {
    const data = await req.body;
    const orderId = await this.orderService.createOrder(data);
    res.status(201).send({ data: { orderId }, message: 'Order is created' });
  }

  public async getAll(_req: Request, res: Response) {
    const data = await this.orderService.getAll();
    console.log('All Data', data);
    res.status(200).send({ data, message: null });
  }

  public async cancelOrder(req: Request, res: Response) {
    const { orderId } = req.params;

    const result = await this.orderService.cancelOrder(orderId);
    res.status(200).send({ data: result, message: 'Order is canceled' });
  }

  public async completeOrder(req: Request, res: Response) {
    const { orderId } = req.params;

    const result = await this.orderService.completeOrder(orderId);
    res.status(200).send({ data: result, message: 'Order is completed' });
  }

  public async getById(req: Request, res: Response) {
    const { orderId } = req.params;

    const result = await this.orderService.getById(orderId);
    res.status(200).send({ data: result, message: null });
  }
}
