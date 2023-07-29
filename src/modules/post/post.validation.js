import joi from "joi";
import { generalFileds } from "../../middleware/validation.js";



export const createPost = {
    body: joi.object({
        title: joi.string().required(),
        caption: joi.string()
    }).required(),

    file: joi.object().required()
}

export const likeOrDislike = {
    params: joi.object({
        id: generalFileds.id,
    }).required()

}

// =========================== comment ===================
export const createComment = {
    body: joi.object({
        title: joi.string().required(),
        caption :joi.string().required()
    }).required(),
    params: joi.object({
        id: generalFileds.id,
    }).required(),
    file: joi.object(),

}