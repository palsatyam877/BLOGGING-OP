const { Router } = require('express');
const User = require('../models/user.js');

const router = Router();

router.get("/signup" , async(req , res) => {
    console.log("Hey");

    return res.render("signup");
});

router.get("/signin" , async(req , res) => {
    return res.render("signin");
})

router.post("/signup" , async(req , res) => {
    const {fullname , email , password} = req.body;
    const user = await User.create({
        fullname,
        email,
        password
    });

    return res.redirect("/");
});

router.post("/signin" , async(req , res) => {
    const {email , password} = req.body;

    try {
        const token = await User.checkPass(email , password);
        return res.cookie("token" , token).redirect("/");
    } catch (error) {
        return res.render("signin" , {
            error : "Incorrect email or password",
        });
    }
});

router.get("/logout" , async(req , res) => {
   res.clearCookie('token');
   res.redirect("/");
});

module.exports = router;