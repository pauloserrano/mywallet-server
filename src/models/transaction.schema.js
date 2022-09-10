import joi from "joi";

const transactionSchema = joi.object({
    value: joi.number().required(),
    description: joi.string()
})


export default transactionSchema