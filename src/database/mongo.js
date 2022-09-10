import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()


const mongoClient = new MongoClient(process.env.MONGO_URI)

mongoClient.connect()
    .then(() => {
        console.log('Connected succesfully to the server')
    })
    .catch((error) => {
        console.error(error.message)
})


const db = mongoClient.db('mywallet')
export default db