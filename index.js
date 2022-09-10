import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRouter from './src/routes/auth.routes.js'
import transactionRouter from './src/routes/transaction.routes.js'


dotenv.config()
const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cors())
app.use(authRouter)
app.use(transactionRouter)


app.listen(PORT, () => `Magic happens on port ${PORT}`)
