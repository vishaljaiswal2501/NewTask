let axios = require("axios")

let getAllMemes=async function(req,res){
    let options={
        method:"get",
        url:"https://api.imgflip.com/get_memes"
    }
    let pics= await axios(options)
    res.status(200).send({msg:pics.data})
}
let memeId=async function(req,res){
  
  let options={
    method:"get",
    url:"https://api.imgflip.com/get_memes"
  }
  let result =await axios(options)
  for(let i=0;i<20;i++){
    var A=result.data.data.memes[i]["id"]
    console.log(A)
    res.status(200).send({msg:A})
  }
  
  
}
let memehandle= async function(req,res){
    let memesid=req.query.template_id
    let textA=req.query.text0
    let textB= req.query.text1
    let options={
        method:"post",
        url:`https://api.imgflip.com/caption_image?template_id=${memeid}&text0=${textA}&text1=${textB}&username=chewie12345&password=meme@123`
    }

let result=await axios(options)
    res.status(2009).send({msg:result.data})
}


module.exports.getAllMemes=getAllMemes
module.exports.memeId=memeId
module.exports.memehandle=memehandle
