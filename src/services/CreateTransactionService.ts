import AppError from '../errors/AppError';

import { getCustomRepository, getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';


interface Request {

  value: number,
  type: "income" | "outcome",
  title: string,
  category: string,


}

class CreateTransactionService {
  public async execute({ value, type, title, category }: Request): Promise<Transaction> {
    // TODO

    const transactionRepository = getCustomRepository(TransactionsRepository)
    const categoryRepository = getRepository(Category)


    const { total } = await transactionRepository.getBalance()

    if (["outcome"].includes(type) && total < value) throw new AppError("You have not enough of balance")

    if (!["income", "outcome"].includes(type)) throw new AppError("Income type must be or income or outcome")

    let transactionCategory = await categoryRepository.findOne({
      where: {
        title: category
      }
    })

    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({ title: category })

      await categoryRepository.save(transactionCategory)
    }

    const transaction = transactionRepository.create({ type, title, value, category: transactionCategory })

    await transactionRepository.save(transaction)


    return transaction



  }
}

export default CreateTransactionService;
