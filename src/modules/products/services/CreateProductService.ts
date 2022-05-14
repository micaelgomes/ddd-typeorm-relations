import { getRepository } from 'typeorm';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

@injectable()
class CreateProductService {
  constructor(private productsRepository: IProductsRepository) {}

  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const productRepository = getRepository<Product>(Product);

    const newProduct = productRepository.create({
      name,
      price,
      quantity,
    });

    const product = await productRepository.save(newProduct);

    return product;
  }
}

export default CreateProductService;
