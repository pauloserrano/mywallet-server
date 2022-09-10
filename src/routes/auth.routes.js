import express from 'express'
import * as auth from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/signin', auth.signIn)
router.post('/signup', auth.signUp)


export default router