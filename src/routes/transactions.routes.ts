import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

import uploadConfig from "../config/upload"
import ImportTransactionsService from '../services/ImportTransactionsService';

const uploader = multer(uploadConfig)

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

  const { title, value, type, category } = request.body

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({ title, value, type, category })


  return response.json(transaction)

});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params

  const deleteTransaction = new DeleteTransactionService();

  const transaction = await deleteTransaction.execute({ id })

  response.status(204).send()

});

transactionsRouter.post('/import', uploader.single('file'), async (request, response) => {
  // TODO

  const importTransactions = new ImportTransactionsService()

  const trasactions = await importTransactions.execute(request.file.path)


  return response.json(trasactions)

});

export default transactionsRouter;
  