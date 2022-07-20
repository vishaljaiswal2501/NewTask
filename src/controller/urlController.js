const shortid=require('shortid')
const urlModel = require('../model/urlModel')
const baseUrl = 'http://localhost:3000'

const isValid = (value) => {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}
const regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%.\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%\+.~#?&//=]*)/g

const shortUrl = async function (req, res) {
    try{
    const longUrl  = req.body.longUrl
    if (Object.keys(req.body).length == 0) {
     return res.status(400).send({ status: false, msg: "Body should not be empty" })
    }
    if(!isValid(longUrl)) {
        return res.status(400).send({ status: false, message: "LongUrl cannot be Empty" })
    }
    
    if (!longUrl.match(regex)) return res.status(400).send({ status: false, message: "LongUrl is invalid" })
    const foundUrl = await urlModel.findOne({ longUrl })
    if (foundUrl){
         const data = {
            "urlCode": foundUrl.urlCode,
            "longUrl": foundUrl.longUrl,
            "shortUrl": foundUrl.shortUrl
        }
     return res.status(200).send({ status: true, message: "This url is already exist" ,data: data })
    }
   
   
    const urlCode = shortid.generate()
    const shortUrl = baseUrl + "/" + urlCode
    const result = await urlModel.create({ longUrl, urlCode, shortUrl })
    const data = {
        "urlCode": result.urlCode,
        "longUrl": result.longUrl,
        "shortUrl": result.shortUrl
    }

    res.status(201).send({status:true,msg:"shortUrl is created", data: data })
}catch(err){
    return res.status(500).send({status:false,message:err.message})
}
}

const urlCode = async function (req, res) {
    try{
    const urlCode = req.params.urlCode
    const regex=/^[A-Za-z0-9_-]{7,14}$/

    if (!urlCode.match(regex)) return res.status(400).send({ status: false, message: "urlCode is invalid" })
    const foundCode = await urlModel.findOne({ urlCode: urlCode })

    if (!foundCode) return res.status(404).send({ status: false, message: "urlCode is not found" })
    return res.status(302).redirect(foundCode.longUrl)
}catch(err){
    return res.status(500).send({status:false,message:err.message})
}
}

module.exports = { shortUrl, urlCode }

