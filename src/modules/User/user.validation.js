import joi from 'joi'
import { generalFileds } from '../../middleware/validation.js'


export const getSharedProfile = {
    params: joi.object({
        id: generalFileds.id
    }).required()
}

export const updatePassword = {
    body: joi.object({
        oldPassword: generalFileds.password,
        newPassword: generalFileds.password.invalid(joi.ref('oldPassword')),
        cNewPassword:generalFileds.cPassword.valid(joi.ref('newPassword')),
    }).required()
}

export const updateUser ={
    body : joi.object({
        userName: generalFileds.userName,

    }).required()
}