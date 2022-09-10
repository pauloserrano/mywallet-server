import express from 'express'
import validateTransaction from '../middlewares/validateTransaction.js'
import * as transaction from '../controllers/transaction.controller.js'


const router = express.Router()

router.post('/transaction', validateTransaction, transaction.addTransaction)
router.get('/transaction', transaction.getTransactions)


export default router
