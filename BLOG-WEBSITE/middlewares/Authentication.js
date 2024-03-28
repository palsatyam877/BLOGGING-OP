const { getPayload } = require("../services/authentication");

function checkForTokenAndGenerateUser(cookieName) {
    return (req , res , next) => {
        const tokenCookieValue = req.cookies[cookieName];

        console.log("CFTG -> Middleware " , req.cookies);

        if(!tokenCookieValue) {
          console.log("TT");
          return next();
        }
        
        try{
           const payload = getPayload(tokenCookieValue);
           req.user = payload;
        } catch(error) {}  

        next();
    }
}

module.exports = {
    checkForTokenAndGenerateUser
}