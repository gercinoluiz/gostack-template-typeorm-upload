import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {

  // The code I don't need any bussines rule can be right here

  // ------------- GET ALL TRANSACTIONS
  const getTransactions = getCustomRepository(TransactionsRepository)

  const transactions = await getTransactions.find()

  const balance = await getTransactions.getBalance()

  response.status(200).json({
    transactions: transactions,
    balance: balance
  })


});

transactionsRouter.post('/', async (request, response) => {

  const { title, value, type, category_id } = request.body

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({ title, value, type, category_id })


  return response.json(transaction)

});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
