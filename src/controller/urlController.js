const validUrl = require('valid-url')

const shortid=require('shortid')
const urlModel = require('../model/urlModel')
const baseUrl = 'http://localhost:3000'

const isValid = function (str) {
    if (typeof value === 'undefined' || value === null) return false;
    if (typeof value === 'string' && value.trim().length === 0) return false;
    return true;
}
const regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%.\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%\+.~#?&//=]*)/g

const shortUrl = async function (req, res) {
    const { longUrl } = req.body
    // if(!isValid(longUrl)) return res.status(400).send({status:false,message:"LongUrl cannot be empty"})
    if (!longUrl.match(regex)) return res.status(400).send({ status: false, message: "LongUrl is invalid" })
    const foundUrl = await urlModel.findOne({ longUrl })
    if (foundUrl){
        const result = await urlModel.findOne(foundUrl)
        const data = {
            "urlCode": result.urlCode,
            "longUrl": result.longUrl,
            "shortUrl": result.shortUrl
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

    res.status(201).send({ data: data })
}

const urlCode = async function (req, res) {
    try{
    const urlCode = req.params.urlCode
    if (!shortid.isValid(urlCode)) return res.status(400).send({ status: false, message: "urlCode is invalid" })
    const foundCode = await urlModel.findOne({ urlCode: urlCode })
    //console.log(foundCode.longUrl)
    if (!foundCode) return res.status(404).send({ status: false, message: "urlCode is not found" })
    return res.status(302).redirect(foundCode.longUrl)
}catch(err){
    return res.status(500).send({status:false,message:err.message})
}
}

module.exports = { shortUrl, urlCode }