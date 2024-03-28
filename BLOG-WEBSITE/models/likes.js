const {Schema , model,  default: mongoose} = require('mongoose');

const LikeSchema = new Schema({
    likedBlog : {
        type: Schema.Types.ObjectId,
        ref : 'blog',
    },
    userLiked : {
        type: Schema.Types.ObjectId,
        ref : 'user',
    },
} , {timestamps : true}); 

const Like = model("like" , LikeSchema);

module.exports = Like;
