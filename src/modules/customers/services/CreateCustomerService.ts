import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  name: string;
  email: string;
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomerProvider')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ name, email }: IRequest): Promise<Customer> {
    const userExistsWithEmail = await this.customersRepository.findByEmail(
      email,
    );

    if (userExistsWithEmail) {
      throw new AppError('Email already used.');
    }

    const newUser = this.customersRepository.create({
      name,
      email,
    });

    return newUser;
  }
}

export default CreateCustomerService;
