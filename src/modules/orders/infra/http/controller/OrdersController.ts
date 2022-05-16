import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';

export default class OrdersController {
  public async show(request: Request, response: Response): Promise<Response> {
    // TODO
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { customer_id, products } = request.body;

    const createOrderService = new CreateOrderService(
      {} as any,
      {} as any,
      {} as any,
    );

    const newOrder = await createOrderService.execute({
      customer_id,
      products,
    });

    return response.json(newOrder);
  }
}
