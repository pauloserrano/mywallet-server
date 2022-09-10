import { ObjectId } from 'mongodb'
import db from '../database/mongo.js'


const addTransaction = async (req, res) => {
    const { value, description } = req.body
    const { authorization, type } = req.headers
    const token = authorization?.replace('Bearer ', '')


    if (!authorization || !type){
        res.sendStatus(401)
        return
    }

    try {
        const session = await db.collection('sessions').findOne({ token })

        if (!session){
            res.sendStatus(404)
            return
        }

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


const getTransactions = async (req, res) => {
    const { authorization } = req.headers
    const token = authorization?.replace('Bearer ', '')

    if (!authorization){
        res.sendStatus(401)
        return
    }

    try {
        const session = await db.collection('sessions').findOne({ token })
        const { transactions } = await db.collection('wallets').findOne(
            { _id: ObjectId(session.walletId)}
        )

        res.send(transactions)

    } catch (error) {
        res.status(500).send(error)
    }
}


export { addTransaction, getTransactions }
