const { Router } = require('express');
const blog = require('../models/blog.js');
const User = require('../models/user.js')
const multer = require('multer');
const path = require('path');
const like = require('../models/likes.js');
const comment = require('../models/comment.js');

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/images/uploads`) )
    },
    filename: function (req, file, cb) {
      const filename = `${Date.now()}-${file.originalname}`
      cb(null, filename);
    }
});
  
const upload = multer({ storage});

router.get("/add-new" , (req , res) => {
    return res.render("addBlog" , {
        user : req.user,
    });
});

router.get("/:id" , async(req , res) => {
     const _blog = await blog.findOne({_id : req.params.id});
     const idOfBlog = req.params.id;
     console.log("_blog " , _blog);

     const Comment = await comment.find({ blogId : idOfBlog }).populate('userId');

     return res.render("blog" , {
           user : req.user,
           blog : _blog,
           Comment
     });
});

router.post("/" , upload.single("coverImage") , async (req , res) => {
    console.log("__ req.body ___" , req.body);
    console.log("__ req.file ___" , req.file);
    console.log("__ req.user ___" , req.user);

    const {title , body} = req.body;

    console.log(body);
    
    const _blog = await blog.create({
         title,
         Body : body,
         createdBy : req.user._id,
         coverImage : `images/uploads/${req.file.filename}`,
    });

    return res.redirect(`./blog/${_blog._id}`);
});

router.post("/:id" , async(req , res) => {
      const idOfBlog = req.params.id;
      const idOfUser = req.user?._id;
      console.log("XXXXXXXXXXXXX-" , req.user)
      console.log("--------" , idOfUser);

      if(!idOfUser) {
         return res.render("signup");
      }

      const likeDoc = await like.findOne({likedBlog : idOfBlog , userLiked: idOfUser});
      const Blog = await blog.findById(idOfBlog);

      console.log("likeDoc -> " , likeDoc);

      if(likeDoc) { // user is trying to remove like O(n) from aaray
          console.log("like array len -> " , Blog.liked.length);
          Blog.liked = Blog.liked.filter(val => val !== likeDoc._id);
          
          const n = Blog.liked.length; let flag = false;

          for(let i = 0; i < n - 1; ++i) {
              if(flag) {
                Blog.liked[i] = Blog.liked[i + 1]; 
                continue;
              }
             
              if(Blog.liked[i] === likeDoc._id) {
                flag = true;
                Blog.liked[i] = Blog.liked[i + 1]; 
              }
          }

          Blog.liked.pop();

          Blog.save();
          console.log("like array len -> " , Blog.liked.length);
          await like.deleteMany({_id : likeDoc._id});
      } else { // user is trying to add like to the array
          const likeDoc = await like.create({likedBlog : idOfBlog , userLiked: idOfUser});
          Blog.liked.push(likeDoc._id);
          Blog.save();

          console.log(Blog);
      }

      console.log(Blog);

      const Comment = await comment.find({ blogId : idOfBlog }).populate('userId');

      return res.render("blog" , {blog : Blog , user : req.user , Comment});
});

module.exports = router;