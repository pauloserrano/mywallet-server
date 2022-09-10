import { ObjectId } from 'mongodb'
import db from '../database/mongo.js'
import transactionSchema from '../models/transaction.schema.js'


const addTransaction = async (req, res) => {
    const { value, description } = req.body
    const { authorization, type } = req.headers
    const token = authorization?.replace('Bearer ', '')


    if (!authorization || !type){
        res.sendStatus(400)
        return
    }

    const validTransaction = transactionSchema.validate({ value, description })
    if (validTransaction.error){
        res.status(400).send(validTransaction.error.details)
        return
    }

    try {
        const session = await db.collection('sessions').findOne({ token })
        console.log({ session })
        const wallets = db.collection('wallets')

        const { transactions } = await wallets.findOne(
            {_id: ObjectId(session.walletId)}
        )

        wallets.updateOne(
            {_id: ObjectId(session.walletId)}, 
            {$set: { transactions: [...transactions, { value, description, type }]}}
        )

        res.sendStatus(201)

    } catch (error) {
        res.status(500).send(error)
    }
}

export { addTransaction }