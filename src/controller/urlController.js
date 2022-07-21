const shortid = require('shortid')
const urlModel = require('../model/urlModel')
const baseUrl = 'http://localhost:3000'
const redis = require("redis");

const { promisify } = require("util");

const isValid = (value) => {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}


const redisClient = redis.createClient(
    13180,
    "redis-13180.c212.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("X2LopUpqaXLNvOgWuKx3hCSjXEJh1wmz", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});

const SETEX_ASYNC = promisify(redisClient.SETEX).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


const regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%.\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%\+.~#?&//=]*)/g


//===================================Create Short URL===========================================

const shortUrl = async function (req, res) {
    try {
        const longUrl = req.body.longUrl
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, msg: "Body should not be empty" })
        }
        if (!isValid(longUrl)) {
            return res.status(400).send({ status: false, message: "LongUrl cannot be Empty" })
        }

        if (!longUrl.match(regex)) return res.status(400).send({ status: false, message: "LongUrl is invalid" })
        let cahcedProfileData = await GET_ASYNC(`${longUrl}`)
        let finalResult = JSON.parse(cahcedProfileData)
        if (cahcedProfileData) {
            
            return res.status(200).send({ status: true, message: "This url is already exist", data: finalResult })
        } else {
            const foundUrl = await urlModel.findOne({ longUrl })
            if (foundUrl) {
                const data = {
                    "urlCode": foundUrl.urlCode,
                    "longUrl": foundUrl.longUrl,
                    "shortUrl": foundUrl.shortUrl
                }
                await SETEX_ASYNC(`${longUrl}`,600, JSON.stringify(data))
                return res.status(200).send({ status: true, message: "This url is already exist", data: data })
            }
        }

        const urlCode = shortid.generate()
        const shortUrl = baseUrl + "/" + urlCode
        const result = await urlModel.create({ longUrl, urlCode, shortUrl })
        const data = {
            "urlCode": result.urlCode,
            "longUrl": result.longUrl,
            "shortUrl": result.shortUrl
        }

        res.status(201).send({ status: true, msg: "shortUrl is created", data: data })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//===================================redirect Short URL on Long URL===========================================

const urlCode = async function (req, res) {
    try {
        const urlCode = req.params.urlCode
        const regex = /^[A-Za-z0-9_-]{7,14}$/

        if (!urlCode.match(regex)) return res.status(400).send({ status: false, message: "urlCode is invalid" })
        let cahcedProfileData = await GET_ASYNC(`${urlCode}`)
        let data = JSON.parse(cahcedProfileData)
        if (cahcedProfileData) {
            return res.status(302).redirect(data.longUrl)
        } else {
            const foundCode = await urlModel.findOne({ urlCode: urlCode })
            if (!foundCode) return res.status(404).send({ status: false, message: "urlCode is not found" })
            await SETEX_ASYNC(`${urlCode}`,600, JSON.stringify(foundCode))
            return res.status(302).redirect(foundCode.longUrl)
        }
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { shortUrl, urlCode }

