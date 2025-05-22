import { NextFunction, Request, Response } from 'express';
import { IOrderService } from '.';
import { Context } from '@dto';

export interface IOrderController {
  createOrder(req: Request, res: Response): Promise<void>;
  getAll(req: Request, res: Response): Promise<void>;
  cancelOrder(req: Request, res: Response): Promise<void>;
  completeOrder(req: Request, res: Response): Promise<void>;
  getById(req: Request, res: Response): Promise<void>;
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
