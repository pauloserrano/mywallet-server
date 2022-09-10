import express from 'express'
import validateUser from '../middlewares/validateUser.js'
import * as auth from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/signin', auth.signIn)
router.post('/signup', validateUser, auth.signUp)


export default router