const path = require('path');
const express = require('express');
const app = express();
const userRoute = require("./routes/user.js"); 
const blogRoute = require("./routes/blogRoutes.js");
const commentRoute = require('./routes/commentRoute.js');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const {checkForTokenAndGenerateUser} = require('./middlewares/Authentication.js');
const blog = require('./models/blog.js');


mongoose.connect("mongodb://127.0.0.1:27017/blogdb").then(() => {
    console.log("Db connected ......");
})

const PORT = 8000;
app.set("view engine" , "ejs");
app.set("views" , path.resolve("./views"));
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());
app.use(checkForTokenAndGenerateUser("token"));
app.use(express.static(path.resolve("./public")));

app.use('/user' , userRoute);
app.use('/blog' , blogRoute);
app.use('/comment' , commentRoute);

app.get('/' , async(req , res) => {
    const allBlogs = await blog.find({});
    res.render("home" , {
        user : req.user,
        blogs : allBlogs
    });
});

app.listen(PORT , () => console.log(`Server started at port ${PORT}`));