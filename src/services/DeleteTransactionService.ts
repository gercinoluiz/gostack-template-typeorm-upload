import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

interface Request {
  id: string
}


class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    // TODO




    const transactionRepository = getRepository(Transaction)

    try {
      await transactionRepository.delete(id)
    } catch (error) {
      throw new AppError("Can`t find the selected transa =ction")
    }


  }
}

export default DeleteTransactionService;
