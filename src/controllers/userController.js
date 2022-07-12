const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const { objectValue, forBody, nameRegex, addressValid, mailRegex, mobileRegex, passwordRegex, pinValid } = require('../validators/validation.js')

//===================================================[API:FOR CREATING USER DB]===========================================================

const createUser = async function (req, res) {
    try {
        if (!forBody(req.body))
            return res.status(400).send({ status: false, message: "body should not remain empty" });

        const { title, name, phone, email, password, address } = req.body;

        let street = address.street;
        let city = address.city;
        let pincode = address.pincode;

        const filedAllowed = ["title", "name", "phone", "email", "password"];

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

        if (!nameRegex(name))
            return res.status(400).send({ status: false, message: "Please provide valid name, it should not contains any special characters and numbers" });

        const phoneNo = await UserModel.findOne({ phone: req.body.phone });

        if (!objectValue(phone))
            return res.status(400).send({ status: false, message: "phone must be present" });

        if (phoneNo)
            return res.status(400).send({ status: false, message: "phone number is already taken" });

        if (!mobileRegex(phone))
            return res.status(400).send({ status: false, message: "Please provide valid mobile number" });

        const emailId = await UserModel.findOne({ email: req.body.email });

        if (!objectValue(email))
            return res.status(400).send({ status: false, message: "EmailId must be present" });

        if (emailId)
            return res.status(400).send({ status: false, message: "EmailId already taken" });

        if (!mailRegex(email))
            return res.status(400).send({ status: false, message: "Please enter valid email" });


        if (!objectValue(password))
            return res.status(400).send({ status: false, message: "Password must be present" });

        if (!passwordRegex(password))
            return res.status(400).send({ status: false, message: "Please enter a password which contains min 8 letters & max 15 letters, at least a symbol, upper and lower case letters and a number" });


        if (address) {
            if (typeof address != "object" || Object.keys(address).length == 0)
                return res.status(400).send({ status: false, message: "Address is not a type of object or it is empty" });
        }
        if (!objectValue(street))
            return res.status(400).send({ status: false, message: "street must be present" });

        if (!addressValid(street))
            return res.status(400).send({ status: false, message: "Please enter valid street name" });

        if (!objectValue(city))
            return res.status(400).send({ status: false, message: "city must be present" });

        if (!nameRegex(city))
            return res.status(400).send({ status: false, message: "Please enter valid city name" });

        if (!objectValue(pincode))
            return res.status(400).send({ status: false, message: "pincode must be present" });

        if (!pinValid(pincode))
            return res.status(400).send({ status: false, message: "pincode is not valid" });


        if (!req.body) return res.status(400).send({ status: false, message: "user details is required" });
        let savedData = await UserModel.create(req.body)
        return res.status(201).send({ status: true, message: "Success", data: savedData });

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

//===================================================[API:FOR CREATING LOGIN USER]===========================================================

const loginUser = async function (req, res) {
    try {
        let data = req.body
        let userName = req.body.email;
        let passWord = req.body.password;

        if (Object.keys(data).length == 0)
            return res.status(400).send({ status: false, message: "Please Provide EmailId & Password" });

        if (!userName)
            return res.status(400).send({ status: false, message: "please add the userEmail" });

        if (!passWord)
            return res.status(400).send({ status: false, message: "please add the passWord" });

        let User = await UserModel.findOne({ email: userName, password: passWord });

        if (!User)
            return res.status(401).send({ status: false, message: "email id or the password is not correct" });



        let token = jwt.sign(
            {
                userId: User._id.toString(),
                iat: new Date().getTime(),
                exp: Math.floor(Date.now() / 1000) + (60 * 60)


            },
            "Room-60-Radon"
        );
        res.setHeader("x-api-key", token);
        res.status(200).send({ status: true, message: "Success", data: token });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

module.exports.createUser = createUser
module.exports.loginUser = loginUser