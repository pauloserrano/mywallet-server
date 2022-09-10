import db from '../database/mongo.js'
import bcrypt from 'bcrypt'
import userSchema from '../models/user.schema.js'


const signIn = async (req, res) => {
    const { email, password } = req.body

    
    const user = await db.collection('users').findOne({ email })
    res.send('signin')
}


const signUp = async (req, res) => {
    const { name, email, password } = req.body

    const validUser = userSchema.validate({ name, email, password }, { abortEarly: false })
    
    if (validUser.error){
        res.status(422).send(validUser.error.details)
        return
    }

    try {
        const emailIsUsed = await db.collection('users').findOne({ email })

        if (emailIsUsed){
            res.sendStatus(409)
            return
        }

        const hash = await bcrypt.hash(password, 10)
        db.collection('users').insertOne({ name, email, hash })
        res.sendStatus(201)


    } catch (error) {
        res.status(500).send(error)
    }
}


export { signIn, signUp }
