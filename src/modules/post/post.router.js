import { Router } from "express";
import * as postConteroller from './controller/post.js'
import * as commentConteroller from './controller/comment.js'
import * as validators from './post.validation.js'
import { fileUpload, fileValidation } from "../../utils/cloudMulter.js";
import {auth , roles} from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";

const router = Router()

router.get("/",
    postConteroller.getAllPosts)



router.post("/",
    auth([roles.admin , roles.user]),
    fileUpload(fileValidation.image).single('image'),
    validation(validators.createPost),
    postConteroller.createPost)


    router.patch("/:id/like",
    auth([roles.admin , roles.user]),
    validation(validators.likeOrDislike),
    postConteroller.likePost)


    router.patch("/:id/unlike",
    auth([roles.admin , roles.user]),
    validation(validators.likeOrDislike),
    postConteroller.unlikePost)


    router.delete('/:id',
    auth([roles.admin , roles.user]),
    postConteroller.deletePost
    )

    router.post('/updatePost/:id',
    auth([roles.admin , roles.user]),
    postConteroller.updatePost
    )

    router.patch('/changePrivecy/:id',
    auth,
    postConteroller.changePrivecy)

    router.get('/PrivatePosts',
    auth,
    postConteroller.privatePosts)
// ======================================= comment =====================

router.post("/:id/comment",
    auth([roles.admin , roles.user]),
    fileUpload(fileValidation.image).single('image'),
    // validation(validators.createComment),
    commentConteroller.creatComment)


    router.patch("/comment/:id/like",
    auth([roles.admin , roles.user]),
    validation(validators.likeOrDislike),
    commentConteroller.likeComment) 

    router.patch("/comment/:id/unlike",
    auth([roles.admin , roles.user]),
    validation(validators.likeOrDislike),
    commentConteroller.unlikeComment)




export default router