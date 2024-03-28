const {Schema , model} = require('mongoose');
const {createHmac , randomBytes} = require('crypto');
const { createToken } = require('../services/authentication.js');

const UserSchema = new Schema({
    fullname : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,    
    },
    salt : {
        type : String,
    },
    role : {
        type : String,
        enum : ["ADMIN" , "USER"],
        default : "USER",
    },
    profileImageURL : {
        type : String,
        default : "/images/default.png"
    }
} , {timestamps : true});

UserSchema.pre("save" , function (next) {
    const user = this;

    if(!user.isModified("password")) return;
    
    const salt = randomBytes(16).toString();

    const HashedPassword = createHmac("sha256" , salt)
                           .update(user.password)
                           .digest("hex");
    
    
    this.salt = salt;
    this.password = HashedPassword;                       
    next();
});

UserSchema.static("checkPass" , async function(email , password) {
    const user = await this.findOne({email});

    if(!user) throw new Error("User doesn't exist!");

    const salt = user.salt;

    const recvHash = createHmac("sha256" , salt)
                     .update(password)
                     .digest("hex");

    if(recvHash !== user.password) throw new Error("Incorrect Password");
    console.log("---User--- " , user);
    const token  = createToken(user);

    return token;
})

const User = model("user" , UserSchema);

module.exports = User;