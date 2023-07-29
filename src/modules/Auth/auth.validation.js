import joi from 'joi'
import { generalFileds } from '../../middleware/validation.js'




export const signupSchema = {
    body: joi.object({

        userName: joi.string().min(3).max(25).alphanum().required(),
        email: generalFileds.email,
        password: generalFileds.password,
        cPassword: generalFileds.cPassword.valid(joi.ref("password")).required()
    }).required()
}


export const loginSchema = {
    body: joi.object({
        email: generalFileds.email,
        password:generalFileds.password
    }).required()
}