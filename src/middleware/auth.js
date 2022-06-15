const jwt = require("jsonwebtoken");
const authenticate = function(req, res, next) {
    //check the token in request header
    //validate this token
    let token = req.headers["x-auth-token"];
    console.log(token)
    
 
     if(token===undefined) return res.send({status: false, msg: "token must be present in the request header"})
    
    let decodedToken = jwt.verify(token, 'functionup-thorium')

    if(!decodedToken) {
        return res.send({status: false, msg:"token is not valid"})
    }else{
    next()
    }
}


const authorise = async function(req, res, next) {
    // comapre the logged in user's id and the id in request
    
    //userId for the logged-in user
  
    let token = req.headers["x-auth-token"]
    if (!token) token=req.headers["x-auth-token"];
    //userId comparision to check if the logged-in user is requesting for their own data
    let decodedToken = jwt.verify(token, 'functionup-thorium')

    if(decodedToken.userId!==req.params.userId) {
        return res.send({status: false, msg:"UserId or token is wrong"})
    }else{
    next()
}
}
module.exports.authenticate=authenticate
module.exports.authorise=authorise