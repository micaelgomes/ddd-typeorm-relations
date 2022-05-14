import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { getRepository } from 'typeorm';
import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  name: string;
  email: string;
}

@injectable()
class CreateCustomerService {
  constructor(private customersRepository: ICustomersRepository) {}

  public async execute({ name, email }: IRequest): Promise<Customer> {
    const customersRepository = getRepository<Customer>(Customer);

    const userExistsWithEmail = await customersRepository.findOne({
      where: {
        email,
      },
    });

    if (userExistsWithEmail) {
      throw new AppError('Email already used.');
    }

    const newUser = customersRepository.create({
      name,
      email,
    });

    const userCreated = await customersRepository.save(newUser);

    return userCreated;
  }
}

export default CreateCustomerService;
