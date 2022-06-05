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

    if (productsInStorage.length !== products.length) {
      throw new AppError('At least one product dont existis.');
    }

    const order_products = await Promise.all(
      products.map(async product => {
        const productStoraged = productsInStorage.find(
          p => product.id === p.id,
        );

        if (!productStoraged) {
          throw new AppError('No products with this ID.');
        }

        if (product.quantity > productStoraged.quantity) {
          throw new AppError('No quantity suficient.');
        }

        productStoraged.quantity -= product.quantity;
        await this.productsRepository.updateQuantity(productStoraged);

        return {
          product_id: product.id,
          quantity: product.quantity,
          price: Number(productStoraged?.price),
        };
      }),
    );

    const newOrder = await this.ordersRepository.create({
      customer,
      products: order_products,
    });

    const orderDto = {
      ...newOrder,
      order_products: newOrder.order_products.map(p => ({
        ...p,
        product_id: p.product_id,
        price: p.price.toFixed(2) as any,
        quantity: p.quantity,
      })),
    };

    // await this.productsRepository.updateQuantity(products);

    return orderDto;
  }
}

export default CreateOrderService;
