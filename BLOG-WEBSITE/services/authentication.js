const JWT = require('jsonwebtoken');
const secret = "happycoding";

function createToken(user) {
    const payload = {
        _id : user._id,
        email : user.email,
        password : user.password,
        role : user.role,
        fullname : user.fullname,
    };

    return JWT.sign(payload , secret);
}

function getPayload(token) {
    return JWT.verify(token  , secret);
}

module.exports = {createToken , getPayload};