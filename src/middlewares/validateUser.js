import userSchema from '../models/user.schema.js'

const validateUser = (req, res, next) => {
    const { name, email, password } = req.body

    const validUser = userSchema.validate({ name, email, password }, { abortEarly: false })
    
    if (validUser.error){
        res.status(400).send(validUser.error.details)
        return
    }
    next()
}

export default validateUser