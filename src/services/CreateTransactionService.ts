import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';


interface Request {

  value: number,
  type: "income" | "outcome",
  title: string,
  category_id: string,


}

class CreateTransactionService {
  public async execute({ value, type, title, category_id }: Request): Promise<Transaction> {
    // TODO

    const transactionRepository = getCustomRepository(TransactionsRepository)

    if (!["income", "outcome"].includes(type)) throw new AppError("Income type must be or income or outcome")

    const transaction = transactionRepository.create({ type, title, value, category_id })

    transactionRepository.save(transaction)


    return transaction



  }
}

export default CreateTransactionService;
