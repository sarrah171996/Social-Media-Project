import commentModel from "../../../../DB/model/Comment.js";
import postModel from "../../../../DB/model/Post.js";
import cloudinary from "../../../utils/cloudinary.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const creatComment = asyncHandler(async (req, res, next) => {
    try {
        const post = await postModel.findById(req.params.id)
        if (!post) {
            return next(new Error('In-valid post is', { cause: 404 }))
    
        }
        req.body.postId = post._id;
        req.body.userId = req.user._id;
        if (req.file) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: 'Comment' })
            req.body.images = { secure_url, public_id }
        }
        
        const comment = await commentModel.create(req.body)
        post.comment.push(comment._id)
        post.save()
        return res.json({ msg: 'done', comment })
  
      
    
    } catch (error) {
        return res.json({ msg: 'error', error })
    }
})


export const likeComment = asyncHandler(async (req, res, next) => {

   
    const { id } = req.params;
    const { _id } = req.user;
    const post = await commentModel.findByIdAndUpdate(
      id,
        {
            $addToSet: { like: _id },
            $pull:{unlike: _id}
        },
        {new : true}

    )
if(!post) {return next(new Error ('In-valid post id'),{cause:404})}
    post.totalVote = post.like.length - post.unlike.length
    await post.save()
    return res.status(201).json({ msg: 'Done', post })

} 

)


export const unlikeComment = asyncHandler(async (req, res, next) => {

   
    const { id } = req.params;
    const { _id } = req.user;
    const post = await commentModel.findByIdAndUpdate(
      id,
        {
            $addToSet: { unlike: _id },
            $pull:{like: _id}

        },
        {new : true}

    )
    post.totalVote = post.like.length - post.unlike.length
    await post.save()

    return res.status(201).json({ msg: 'Done', post })

} 

)
