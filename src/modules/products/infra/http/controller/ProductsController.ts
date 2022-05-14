import { Request, Response } from 'express';

import { container } from 'tsyringe';
import CreateProductService from '@modules/products/services/CreateProductService';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';

export default class ProductsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, price, quantity } = request.body;

    const createProductService = new CreateProductService(
      {} as IProductsRepository,
    );

    const createdProduct = await createProductService.execute({
      name,
      price,
      quantity,
    });

    return response.json(createdProduct);
  }
}
