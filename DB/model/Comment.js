import mongoose, { model, Schema, Types } from "mongoose";
const commentSchema = new Schema({

    title:{type:String , required :true},
    caption:{type:String , required :true},
    image: {type:Object },
    userId: {type: Types.ObjectId,ref:'User',required:true },
    postId: {type: Types.ObjectId,ref:'Post',required:true },
    like:[{type: Types.ObjectId,ref:'User' }],
    unlike:[{type: Types.ObjectId,ref:'User' }],
    isDeleted:{type:Boolean , default:false},
}, {
    timestamps: true
})


const commentModel = mongoose.models.comment || model('Comment', commentSchema);
export default commentModel