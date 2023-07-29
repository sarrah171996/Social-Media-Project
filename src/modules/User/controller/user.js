import userModel from "../../../../DB/model/User.js"
import cloudinary from "../../../utils/cloudinary.js"
import sendEmail from "../../../utils/email.js"
import { asyncHandler } from '../../../utils/errorHandling.js'
import { compare, hash } from '../../../utils/HashAndCompare.js'
import { nanoid } from 'nanoid'

export const getUserModule = (req, res, next) => {

    return res.json({ message: "User module" })
}

export const getProfile = asyncHandler(async (req, res, next) => {

    const user = await userModel.findById(req.user._id)
        .populate([
            {
                path: 'postat',
            },
        ])
    if (user.isDeleted) {

        return res.status(404).json({ msg: 'user not registerd' })
    }


    return res.status(200).json({ message: "Done", user })



})


export const sharedProfileData = asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const user = await userModel.findById(id).select('userName email profilePic -post')
    return user ? res.status(200).json({ message: "Done", user }) :
        next(new Error('In-valid account Id', { cause: 404 }))
})


export const updatePassword = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const { oldPassword, newPassword } = req.body;
    const user = await userModel.findById(_id)
    if (!compare({ plaintext: oldPassword, hashValue: user.password })) {
        return next(new Error("In-valid old Password", { cause: 400 }))
    }
    const hashPassword = hash({ plaintext: newPassword })
    user.password = hashPassword;
    await user.save();
    return res.status(200).json({ message: "Done" })
})

export const profilePic = asyncHandler(async (req, res, next) => {


    if (!req.file) {
        return next(new Error("image is required", { cause: 400 }))
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `user/${req.user.id}/profile` })
    const user = await userModel.findOneAndUpdate(req.user._id, { profilePic: { secure_url, public_id } }, { new: false })

    if (user.isDeleted) {
        return res.status(404).json({ msg: 'user not registerd' })
    }

    await cloudinary.uploader.destroy(user.profilePic.public_id)
    return res.json({ msg: 'done', user, file: req.file })



})


export const profileCoverPic = asyncHandler(async (req, res, next) => {
    if (!req.files?.length) {
        return next(new Error("images are required", { cause: 400 }))
    }
    const coverPic = [];
    for (const file of req.files) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `user/${req.user.id}/profile/cover` })

        coverPic.push({ secure_url, public_id })
    }
    const user = await userModel.findOneAndUpdate(req.user._id, { coverPic }, { new: true })
    if (user.isDeleted) {
        return res.status(404).json({ msg: 'user not registerd' })
    }

    return res.json({ msg: 'done', user })
})

export const deleteUser = asyncHandler(async (req, res, next) => {
    const { id } = req.user
    const user = await userModel.findByIdAndDelete(id)
    if (user.softDelete == 'false') {

        if (!user) {
            return res.status(404).json({ msg: 'user not found' })

        }

        return res.status(201).json({ msg: 'Done' })
    }

    return res.status(404).json({ msg: 'user not registerd' })


})

export const softDelete = asyncHandler(async (req, res, next) => {
    const { id } = req.user
    const user = await userModel.findById(id)


    if (!user) {
        return res.status(404).json({ msg: 'user not found' })

    }

    user.isDeleted = true


    return res.status(201).json({ msg: 'Done', user })


})

export const updateUser = asyncHandler(async (req, res, next) => {
    const { id } = req.user
    const user = await userModel.findByIdAndUpdate(id, req.body)

    if (!user) {
        return res.status(404).json({ msg: 'user not found' }, { new: true })
    }

    return res.json({ msg: 'done', user })


})
export const logout = (async (req, res, next) => {
    const { _id } = req.user
    try {
        const user = await userModel.findByIdAndUpdate(_id)
        user.status = 'offline'


        return res.status(201).json({ msg: 'Done', user })


    } catch (error) {
        return res.json({ msg: 'error', error: error })
    }
})


export const forgetPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
try {
    const user = await userModel.findOne({email})
    if(!user){
        return res.json({ msg: 'user not found'})
        
        
    }
    let code =nanoid(4)
    // console.log(code);
    const token = generateToken({ payload: { email }, expiresIn: 60 * 5 })
    const link = `http://localhost:5000/auth/confirmEmail/${token}`
    sendEmail({ to: email, subject: 'verify your password', link}) 
    const sendCode = await userModel.findByIdAndUpdate({email},{code},{new:true})
    sendCode? res.status(200).json({msg: 'success' , code , link}) :
     res.status(400).json({msg: 'fail' }) 


} catch (error) {
    return res.json({ msg: 'error', error: error })
    
}
})
