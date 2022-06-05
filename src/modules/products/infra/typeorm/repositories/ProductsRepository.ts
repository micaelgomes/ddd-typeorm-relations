import { getRepository, Repository } from 'typeorm';

import AppError from '@shared/errors/AppError';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const newProduct = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(newProduct);

    return newProduct;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({
      where: {
        name,
      },
    });

    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const productsInStorage = await this.ormRepository.findByIds(products);

    return productsInStorage;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    // Será que não eh possível fazer operações em Batch?
    const updateProducts: Product[] = [];

    products.forEach(async product => {
      const productStoraged = await this.ormRepository.findOne(product.id);

      if (!productStoraged) {
        throw new AppError('No products with this ID.');
      }

      productStoraged.quantity -= product.quantity;
      const userUpdated = await this.ormRepository.save(productStoraged);

      updateProducts.push(userUpdated);
    });

    return updateProducts;
  }
}

export default ProductsRepository;
