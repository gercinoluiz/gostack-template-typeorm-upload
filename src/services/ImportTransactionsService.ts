import Transaction from '../models/Transaction';
import fs from "fs"
import csvParse from "csv-parse"
import parse from 'csv-parse';
import { getCustomRepository, getRepository, In, } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';


interface csvTransaction {

  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string

}

class ImportTransactionsService {
  async execute(filePath: string): Promise<void> {

    const transactionRepository = getCustomRepository(TransactionsRepository)
    const categoriesRepository = getRepository(Category)

    // Reading the data inside the CSV

    const contactsReadStram = fs.createReadStream(filePath)

    const parsers = csvParse({
      from_line: 2 //what line I want to start reading the CSV

      // The pipe thing will read the the line is available

    })
    const parseCSV = contactsReadStram.pipe(parsers)

    const transactions: csvTransaction[] = [];
    const categories: string[] = []


    // fOR EACH LINE i WILL TRIM THE TEXT
    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      )

      if (!title || !type || !value) return;

      categories.push(category)
      transactions.push({ title, type, value, category })

    })


    // I did't get this, but I know that I have to await the end signal to retrieve data from the sincronous parseCsv
    await new Promise(resolve => parseCSV.on('end', resolve))

    // ALL after the end event above

    const exitentCategories = await categoriesRepository.find({
      where: {
        title: In(categories)
      }
    })

    const exitentCategoriesTitle = exitentCategories.map((category: Category) => category.title)

    // I find what does not exist in the DB and duplicates
    const addCategoryTitles = categories
      .filter(category => !exitentCategoriesTitle.includes(category))
      .filter((value, index, self) => self.indexOf(value) == index)


    const newCategoriesInDB = categoriesRepository.create(addCategoryTitles.map(title => ({ title })))


    await categoriesRepository.save(newCategoriesInDB)


    const finalCategories = [...newCategoriesInDB, ...exitentCategories]


    const createdTransactions = transactionRepository.create(

      transactions.map(transaction => ({
        title: transaction.title,
        value: transaction.value,
        type: transaction.type,
        category: finalCategories.find(category => category.title === transaction.title)
      }))


    )

    await transactionRepository.save(createdTransactions)

    await fs.promises.unlink(filePath)

    console.log(categories)
    console.log(transactions)

  }


}

export default ImportTransactionsService;
