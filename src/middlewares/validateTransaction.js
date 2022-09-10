import transactionSchema from "../models/transaction.schema.js"


const validateTransaction = (req, res, next) => {
    const { value, description } = req.body

    const validTransaction = transactionSchema.validate({ value, description })
    if (validTransaction.error){
        res.status(400).send(validTransaction.error.details)
        return
    }
    next()
}

export default validateTransaction