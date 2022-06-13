const mid1= function(req,res,next){
    
        var newHeader=req.headers.isfreeappuser
      if(!newHeader){
        res.send("isFreeAppUser is required")
      }else{
        next();
        
      }

}
module.exports.mid1=mid1