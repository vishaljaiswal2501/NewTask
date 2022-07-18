const validUrl = require("valid-url");
const shortId = require("short-id");
const urlModel = require("../model/urlModel");
const baseUrl = "http://localhost:3000";

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};
const regex =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%.\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%\+.~#?&//=]*)/g;

const shortUrl = async function (req, res) {
  const { longUrl } = req.body;
  if (!isValid(longUrl))
    return res
      .status(400)
      .send({ status: false, message: "LongUrl cannot be empty" });
  if (!regex.test(longUrl))
    return res
      .status(400)
      .send({ status: false, message: "LongUrl is invalid" });
  const foundUrl = await urlModel.findOne({ longUrl });
  if (foundUrl)
    return res
      .status(400)
      .send({
        status: false,
        message: "This url is already exist",
        data: foundUrl,
      });
  const urlCode = shortId.generate();
  const shortUrl = baseUrl + "/" + urlCode;
  const urlCreated = await urlModel.create({ longUrl, urlCode, shortUrl });
  res.status(200).send({ data: urlCreated });
};

const urlCode = async function (req, res) {
  const { urlCode } = req.params;
  const foundCode = await urlModel.findOne({ urlCode });
  if (!foundCode)
    return res
      .status(404)
      .send({ status: false, message: "urlCode is not found" });
  res.redirect(foundCode.longUrl);
};

module.exports = { shortUrl, urlCode };
