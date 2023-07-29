import { Router } from "express";
import {auth , roles} from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import {fileUpload, fileValidation} from "../../utils/cloudMulter.js";
import * as  userController from './controller/user.js'
import * as validators from './user.validation.js'
const router = Router()



router.get("/", userController.getUserModule)


router.get("/profile", auth([roles.admin , roles.user]), userController.getProfile)
router.get("/profileData/:id" ,validation(validators.getSharedProfile),auth([roles.admin , roles.user]), userController.sharedProfileData)
router.patch("/password", validation(validators.updatePassword), auth([roles.admin , roles.user]), userController.updatePassword)
router.patch('/profilePic' ,auth([roles.admin , roles.user]),fileUpload(fileValidation.image).single('image') , userController.profilePic)
router.patch('/profileCoverPic' ,auth([roles.admin , roles.user]),fileUpload(fileValidation.image).array('image', 5) , userController.profileCoverPic)
router.delete('/',  auth([roles.admin , roles.user]), userController.deleteUser)
router.patch('/softDelete', auth([roles.admin , roles.user]), userController.softDelete)
router.post("/logout" , auth([roles.admin , roles.user]), userController.logout)
router.post("/updateUser" , validation(validators.updateUser),auth([roles.admin , roles.user]), userController.updateUser)
router.post("/forgetPassword" ,   userController.forgetPassword)



export default router