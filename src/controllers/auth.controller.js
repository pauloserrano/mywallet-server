import { ObjectId } from 'mongodb'
import { v4 as uuid } from 'uuid'
import bcrypt from 'bcrypt'
import db from '../database/mongo.js'


const signIn = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password){
        res.sendStatus(400)
        return
    }

    try {
        const user = await db.collection('users').findOne({ email })
        if (!user){
            res.sendStatus(404)
            return
        }

        const validPassword = await bcrypt.compare(password, user.hash)
        if (!validPassword){
            res.sendStatus(401)
            return
        }

        const inSession = await db.collection('sessions').findOne({ walletId: user.walletId})
        if (inSession){
            await db.collection('sessions').deleteOne({ token: inSession.token })
        }


        const token = uuid()

        db.collection('sessions').insertOne({ token, timestamp: Date.now(), walletId: user.walletId })
        res.status(200).send({name: user.name, token})

    } catch (error) {
        res.status(500).send(error)
    }
}


const signUp = async (req, res) => {
    const { name, email, password } = req.body

    try {
        const emailIsUsed = await db.collection('users').findOne({ email })

        if (emailIsUsed){
            res.sendStatus(409)
            return
        }

        const hash = await bcrypt.hash(password, 10)
        const { insertedId: walletId } = await db.collection('wallets').insertOne({ transactions: [] })
        db.collection('users').insertOne({ name, email, hash, walletId })
        res.sendStatus(201)


    } catch (error) {
        res.status(500).send(error)
    }
}


const signOut = async (req, res) => {
    const { authorization } = req.headers
    const token = authorization?.replace('Bearer ', '')

    if (!authorization){
        res.sendStatus(401)
        return
    }

    try {
        const session = await db.collection('sessions').findOne({ token })
        if (!session){
            res.sendStatus(400)
            return
        }

        db.collection('sessions').deleteOne({ token })
        res.sendStatus(200)

    } catch (error) {
        res.status(500).send(error)
    }
}


export { signIn, signUp, signOut }
