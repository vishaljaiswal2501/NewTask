const jwt = require("jsonwebtoken");
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
