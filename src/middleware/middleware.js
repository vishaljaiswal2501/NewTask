const mid1= function(req,res,next){
    let logIN = true
    if(logIN==true){
        let currentDataAndTime=new Date()
        console.log("today's date & current"+":"+currentDataAndTime+"     "+"Current IP address is"+":"+req.ip+"    "+"currentUrl"+":"+" "+req.originalUrl)
        next()
    }else{
        res.send("please use valid username & password")
    }

}
module.exports.mid1=mid1