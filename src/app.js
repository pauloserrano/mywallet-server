import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'


const PORT = 5000
const app = express()
app.use(express.json())
app.use(cors())
dotenv.config()


app.listen(PORT, () => `Magic happens on port ${PORT}`)
