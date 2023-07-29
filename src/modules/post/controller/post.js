import commentModel from "../../../../DB/model/Comment.js";
import postModel from "../../../../DB/model/Post.js";
import userModel from "../../../../DB/model/User.js";
import cloudinary from "../../../utils/cloudinary.js";
import { asyncHandler } from "../../../utils/errorHandling.js";


// export const getAllPosts = asyncHandler(async (req, res, next) => {
//     const postList =[]
//     const cursor = postModel.find({}).populate([
//         {
//             path:'userId',
//             select:'userName profilePic'
//         },
//         {
//             path:'like',
//             select:'userName profilePic'
//         },
//         {
//             path:'unlike',
//             select:'userName profilePic'
//         },
//     ]).cursor()


// for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
//   console.log(doc); // Prints documents one at a time
//   const comment = await commentModel.find({postId : doc._id})
//   postList.push(doc , comment)
// }

//     return res.status(201).json({ msg: 'Done', postList })
// })


export const getAllPosts = asyncHandler(async (req, res, next) => {
    const postList = await  postModel.find({}).populate([
        {
            path:'userId',
            select:'userName profilePic'
        },
        {
            path:'like',
            select:'userName profilePic'
        },
        {
            path:'unlike',
            select:'userName profilePic'
        },
        {
            path:'comment',
            populate : [
                {
                    path:'userId',
                    select:'userName profilePic'
                },
                {
                    path:'like',
                    select:'userName profilePic'
                },
                {
                    path:'unlike',
                    select:'userName profilePic'
                },
            ]


        },
       
    ])


    return res.status(201).json({ msg: 'Done', postList })
})



export const createPost = asyncHandler(async (req, res, next) => {
    const {_id} = req.user
    const { title, caption } = req.body;
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: 'Post' });
    const post = await postModel.create({
        title,
        caption,
        userId: req.user._id,
        image: { secure_url, public_id }
    })

     const userPost = await userModel.findById(_id)
userPost.posts.push(post)
await post.save()

    return res.status(201).json({ msg: 'Done', post , userPost })
})


export const deletePost= asyncHandler(async (req, res, next)=>{
    const {id} = req.params
    const post = await postModel.findByIdAndDelete(id)
    if(!post){
    return res.status(404).json({ msg: 'post not found' })

    }

    return res.status(201).json({ msg: 'Done' })

})

export const updatePost = asyncHandler(async(req, res, next)=>{
    
    const {postId} = req.params
    const post = await postModel.findOneAndUpdate({postId},req.body)
    if(!post){
        return  res.json({msg:'post not found'},{new:true})

    }

    return  res.json({msg:'done' , post })


})


export const changePrivecy = asyncHandler(async ( req, res , next)=>{
try {
    const {id} = req.params

    const PrivatePosts = await postModel.findByIdAndUpdate(id,post.privecy='private')  

    return  res.json({msg:'done' , id , PrivatePosts})


} catch (error) {
    return  res.json({msg:'error' ,error:error.message})
    
}
})

export const privatePosts = asyncHandler(async ( req, res, next)=>{
    const post = await postModel.find(post.privecy='private')
    if(!post){
    return  res.json({msg:'something wrong'})

    }

    return  res.json({msg:'done' , id , post})


})

//============================= like & unlike ========================== //

export const likePost = asyncHandler(async (req, res, next) => {

   
    const { id } = req.params;
    const { _id } = req.user;
    const post = await postModel.findByIdAndUpdate(
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

export const unlikePost = asyncHandler(async (req, res, next) => {

   
    const { id } = req.params;
    const { _id } = req.user;
    const post = await postModel.findByIdAndUpdate(
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