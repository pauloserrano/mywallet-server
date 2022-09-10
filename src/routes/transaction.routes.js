import express from 'express'
import * as transaction from '../controllers/transaction.controller.js'


const router = express.Router()

router.post('/transaction', transaction.addTransaction)

export default router