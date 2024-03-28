const {Schema, default: mongoose, model} = require('mongoose');

const commentSchema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : "user",
    },
    blogId : {
        type : Schema.Types.ObjectId,
        ref : "blog",
    },
    content : {
        type : String,
    }
});

const Comment = model('comment' , commentSchema);

module.exports = Comment;