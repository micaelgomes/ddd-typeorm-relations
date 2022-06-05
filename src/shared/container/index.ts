import { container } from 'tsyringe';

import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import CustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ProductsRepository from '@modules/products/infra/typeorm/repositories/ProductsRepository';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import OrdersRepository from '@modules/orders/infra/typeorm/repositories/OrdersRepository';

container.registerSingleton<ICustomersRepository>(
  'CustomerProvider',
  CustomersRepository,
);

container.registerSingleton<IProductsRepository>(
  'ProductProvider',
  ProductsRepository,
);

container.registerSingleton<IOrdersRepository>(
  'OrderProvider',
  OrdersRepository,
);
