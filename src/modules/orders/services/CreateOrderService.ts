import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

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
    @inject('OrderProvider')
    private ordersRepository: IOrdersRepository,
    @inject('ProductProvider')
    private productsRepository: IProductsRepository,
    @inject('CustomerProvider')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer not in storage.');
    }

    const ids = products.map(product => ({ id: product.id }));
    const productsInStorage = await this.productsRepository.findAllById(ids);

    const order_products = products.map(product => {
      const productStoraged = productsInStorage.find(p => product.id === p.id);

      return {
        product_id: product.id,
        quantity: product.quantity,
        price: Number(productStoraged?.price),
      };
    });

    const newOrder = await this.ordersRepository.create({
      customer,
      products: order_products,
    });

    return newOrder;
  }
}

export default CreateOrderService;
