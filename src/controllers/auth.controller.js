import { ObjectId } from 'mongodb'
import { v4 as uuid } from 'uuid'
import bcrypt from 'bcrypt'
import db from '../database/mongo.js'
import userSchema from '../models/user.schema.js'


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


        const inSession = await db.collection('sessions').findOne({ userID: ObjectId(user._id)})
        if (inSession){
            await db.collection('sessions').deleteOne({ userID: ObjectId(user._id) })
        }


        const token = uuid()

        db.collection('sessions').insertOne({ token, timestamp: Date.now(), walletId: user.walletId })
        res.status(200).send({token})

    } catch (error) {
        res.status(500).send(error)
    }
}


const signUp = async (req, res) => {
    const { name, email, password } = req.body

    const validUser = userSchema.validate({ name, email, password }, { abortEarly: false })
    
    if (validUser.error){
        res.status(400).send(validUser.error.details)
        return
    }

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


export { signIn, signUp }
