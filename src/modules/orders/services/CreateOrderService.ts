import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

import { getRepository } from 'typeorm';
import Customer from '@modules/customers/infra/typeorm/entities/Customer';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    private ordersRepository: IOrdersRepository,
    private productsRepository: IProductsRepository,
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const cusmoterRepository = getRepository<Customer>(Customer);
    const orderRepository = getRepository<Order>(Order);

    const customer = await cusmoterRepository.findOne(customer_id);

    const newOrder = orderRepository.create({
      customer,
      order_products: products.map(p => ({ ...p, price: 0.99 })),
    });

    const orderSaved = await orderRepository.save(newOrder);

    return orderSaved;

    // console.log('Inside service');

    // console.log({
    //   customer_id,
    //   products,
    // });
  }
}

export default CreateOrderService;
