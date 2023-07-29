import mongoose, { model, Schema, Types } from "mongoose";
const postSchema = new Schema({

    title:{type:String , required :true},
    comment:[{type: Types.ObjectId,ref:'Comment' }],
    caption: String,
    image: {type:Object , required:true},
    userId: {type: Types.ObjectId,ref:'User',required:true },
    like:[{type: Types.ObjectId,ref:'User' }],
    unlike:[{type: Types.ObjectId,ref:'User' }],
    isDeleted:{type:Boolean , default:false},
    totalVote : {
        type : Number,
        default : 0
    },
    privecy : {
        type : String,
        enum : ['public' , 'private'],
        default : 'public'
    }
}, {
    timestamps: true
})


const postModel = mongoose.models.post || model('Post', postSchema);
export default postModel