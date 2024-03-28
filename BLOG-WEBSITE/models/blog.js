const {Schema , model, default: mongoose} = require('mongoose');

const blogSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    Body : {
        type : String,
        required : true,
    },
    coverImage : {
        type : String,
        required : false,
    },
    createdBy : {
        type : Schema.Types.ObjectId,
        ref : "user",
    },
    liked : {
        type : [
            {
               type : Schema.Types.ObjectId,
               ref : "like",
            }
        ],
    },
    commented : {
        type : [
            {
               type : Schema.Types.ObjectId,
               ref : "comment",
            }
        ],     
    }
} , {timestamps : true});

const Blog = model("blog" , blogSchema);

module.exports = Blog;