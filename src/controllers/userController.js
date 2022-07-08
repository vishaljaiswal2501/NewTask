const UserModel = require("../models/userModel")
const jwt = require("jsonwebtoken");

const { objectValue, keyValue, nameRegex, mobileRegex, mailRegex, passwordRegex } = require('../validators/validation.js')

const createUser = async function (req, res) {
    try {

        const { title, name, phone, email, password } = req.body;
        const emailId = await UserModel.findOne({ email: req.body.email })
     //   console.log(emailId)
        const phoneNo = await UserModel.findOne({ phone: req.body.phone })

        const filedAllowed = ["title", "name", "phone", "email", "password"] //, "street", "city", "pincode"

        if (!keyValue(req.body))
            return res.status(400).send({ status: false, message: "body should not remain empty" })

        const keyOf = Object.keys(req.body);
        const receivedKey = filedAllowed.filter((x) => !keyOf.includes(x));
        if (receivedKey.length) {
            return res.status(400).send({ status: false, message: `${receivedKey} field is missing` });
        }

        if (!objectValue(title))
            return res.status(400).send({ status: false, message: "title must be present" });

        if (req.body.title != 'Mr' && req.body.title != 'Mrs' && req.body.title != 'Miss')
            return res.status(400).send({ status: false, message: "Please enter valid title from these options only [Mr, Mrs, Miss]" });

        if (!objectValue(name))
            return res.status(400).send({ status: false, message: "name must be present" });

        if (!objectValue(phone))
            return res.status(400).send({ status: false, message: "phone must be present" });

        if (phoneNo)
            return res.status(400).send({ status: false, message: "phone number is already taken" });

        if (!objectValue(email))
            return res.status(400).send({ status: false, message: "email must be present" });

        if (emailId)
            return res.status(400).send({ status: false, message: "emailId already taken" });


        if (!objectValue(password))
            return res.status(400).send({ status: false, message: "password must be present" });

        // if (!objectValue(title || name || phone || email || password || address))
        //     return res.status(400).send({ status: false, message: "(title, name, phone, email, password) these field must be present" })

        // if (!nameRegex(title))
        //     return res.status(400).send({ status: false, message: "Please enter valid title only from [Mr, Mrs, Miss]" })

        if (!mobileRegex(phone))
            return res.status(400).send({ status: false, message: "Please enter valid mobile number" })

        if (!mailRegex(email))
            return res.status(400).send({ status: false, message: "Please enter valid email" })

        if (!passwordRegex(password))
            return res.status(400).send({ status: false, message: "Please enter a password which contains min 8 letters & max 15 letters, at least a symbol, upper and lower case letters and a number" })




        if (!req.body) return res.status(400).send({ status: false, message: "user details is required" })
        let savedData = await UserModel.create(req.body)
        return res.status(201).send({ status: true, data: savedData })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}
const loginUser = async function (req, res) {
    try{
    let data = req.body
    let userName = req.body.email;
    let passWord = req.body.password;
    if (Object.keys(data).length == 0)
    return res.status(400).send({ status: false, message: "Please Provide EmailId & Password" })

    if (!userName)
    return res.status(400).send({ status: false, message: "please add the userEmail" })

    if (!passWord)
    return res.status(400).send({ status: false, message: "please add the passWord" })



    const User = await UserModel.findOne({ email: userName, password: passWord });
    // console.log(author)
    if (!User)
        return res.status(401).send({status: false, message: "email id or the password is not correct"});


    let token = jwt.sign(
        {
            userId: User._id.toString(),
            iat: new Date().getTime(),
            exp: Math.floor(Date.now() / 1000) + (60 * 60)

        },
        "Room-60-Radon"
    );
    res.setHeader("x-api-key", token);
    res.status(200).send({ status: true, data: token });
}catch(error) {
    res.status(500).send({ status: false, message: error.message })
}
}

module.exports.createUser = createUser
module.exports.loginUser = loginUser