const {Router} = require('express');
const blog = require('../models/blog.js');
const comment = require('../models/comment.js');

const router = Router();


router.post("/:id" , async(req , res) => {
    const idOfBlog = req.params.id;
    const idOfUser = req.user?._id;
    const {content} = req.body;
    console.log("*********************-" , req.user)
    console.log("--------" , idOfUser);
  
    if(!idOfUser) {
       return res.render("signup");
    }
  
    const Blog = await blog.findById(idOfBlog);
    
    { // user is trying to add comment to the array
        const commentDoc = await comment.create(
            {
                blogId : idOfBlog , 
                userId: idOfUser ,
                content : content, 
            }
        );

        Blog.commented.push(commentDoc._id);
        Blog.save();
  
        console.log(Blog);
    }
  
    console.log(Blog);
    const Comment = await comment.find({ blogId : idOfBlog }).populate('userId');
  
    console.log("Comment -> " , Comment);
  
    return res.render("blog" , {blog : Blog , user : req.user , Comment : Comment});
});

module.exports = router;