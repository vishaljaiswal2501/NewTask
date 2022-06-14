const jwt = require("jsonwebtoken");

  
const mid1= function(req,res,next){
    
    var newHeader=req.headers["x-Auth-token"]
  if(!newHeader){
    res.send("header is required")
  }else{
    next();
    
  }

}
module.exports.mid1=mid1