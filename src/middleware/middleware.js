const jwt = require("jsonwebtoken");
const BlogModel = require("../models/blogModel")
let authentication = function (req, res, next) {
    try{
        const blogId=req.params.blogId;
        if(blogId){
        if(!(blogId.match(/^[0-9a-fA-F]{24}$/))){
            return res.status(400).send({status:false,msg:"please provide 24 digit BlogId"})
          }
        }

     
       
       
    let token = req.headers["x-api-key"];

    
    if (!token) return res.status(400).send({ status: false, msg: "Token Must be Present" })

    let decodedToken = jwt.verify(token, "Room-8-Radon");
    if (!decodedToken)
        return res.status(401).send({ status: false, msg: "token is invalid" })
        req.authIdNew = decodedToken.userId
    next()
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}



//=============== Authorisation  ================================ 

const authorisation = async function (req, res, next) {
    let userLoggedIn = req.authIdNew

  
        let blogId = req.params.blogId
        
        let authId = await BlogModel.findOne({ _id: blogId }).select({ authorId: 1, _id: 0 })
        if(!authId) return res.status(403).send({ status: false, msg: 'Please enter valid blog ID' })
        let newAuth = authId.authorId.valueOf()
        console.log(newAuth)
        if (newAuth != userLoggedIn) return res.send({ status: false, msg: 'User logged is not allowed to modify the requested users data' })
    
    // else {
    //     // Blog creation
    //     let requestUser = req.body.authorId
    //     if (requestUser != userLoggedIn) return res.send({ status: false, msg: 'User logged is not allowed to modify the requested users data' })
    // }
    next()
}

// const authorisation =async function (req, res, next) {
//     // try{
//     let token = req.headers["x-api-key"]
//     if(!token) return res.status(500).send({status: false, msg: "token must be present in the request header"})
//     let decodedToken = jwt.verify(token, 'Room-8-Radon')
//     if(!decodedToken) return res.status(500).send({status: false, msg:"token is not valid"})


//     let userToBeModified = req.query.email
//     let userLoggedIn = decodedToken.userName
//     if(userToBeModified != userLoggedIn) return res.status(403).send({status: false, msg: 'User logged is not allowed to modify the requested users data'})
//     next()
// // }
// // catch (err) {
// //     res.status(500).send({ status: false, msg: err.message })
// // }
// }

module.exports.authentication = authentication
module.exports.authorisation = authorisation