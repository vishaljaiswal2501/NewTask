const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const { objectValue, forBody, nameRegex, addressValid, mailRegex, mobileRegex, passwordRegex, pinValid } = require('../validators/validation.js')

//===================================================[API:FOR CREATING USER DB]===========================================================

const createUser = async function (req, res) {
    try {
        if (!forBody(req.body))
            return res.status(400).send({ status: false, message: "Body should not remain empty" });

        const { title, name, phone, email, password, address } = req.body;

        // let street = address.street;
        // let city = address.city;
        // let pincode = address.pincode;

        const filedAllowed = ["title", "name", "phone", "email", "password"];

        const keyOf = Object.keys(req.body);
        const receivedKey = filedAllowed.filter((x) => !keyOf.includes(x));
        if (receivedKey.length) {
            return res.status(400).send({ status: false, message: `${receivedKey} field is missing` });
        }

        if (!objectValue(title))
            return res.status(400).send({ status: false, message: "Title name must be present" });

        if (title != 'Mr' && title != 'Mrs' && title != 'Miss')
            return res.status(400).send({ status: false, message: "Please enter valid title from these options only [Mr, Mrs, Miss]" });

        if (!objectValue(name))
            return res.status(400).send({ status: false, message: "Name must be present" });

        if (!nameRegex(name))
            return res.status(400).send({ status: false, message: "Please provide valid name, it should not contains any special characters and numbers" });

        const phoneNo = await UserModel.findOne({ phone: phone });

        if (phoneNo)
            return res.status(400).send({ status: false, message: "Phone number is already taken" });

        if (!objectValue(phone))
            return res.status(400).send({ status: false, message: "Phone number must be present" });

        if (!mobileRegex(phone))
            return res.status(400).send({ status: false, message: "Please provide valid mobile number" });

        const emailId = await UserModel.findOne({ email: email });

        if (emailId)
            return res.status(400).send({ status: false, message: "EmailId already taken" });

        if (!objectValue(email))
            return res.status(400).send({ status: false, message: "EmailId must be present" });

        if (!mailRegex(email))
            return res.status(400).send({ status: false, message: "Please enter valid email" });


        if (!objectValue(password))
            return res.status(400).send({ status: false, message: "Password must be present" });

        if (!passwordRegex(password))
            return res.status(400).send({ status: false, message: "Please enter a password which contains min 8 letters & max 15 letters, at least a symbol, upper and lower case letters and a number" });

        if (!Object.keys(address).length == 0) {
            if (typeof address != "object")
                return res.status(400).send({ status: false, message: "Address is not a type of object" });

            if (!objectValue(address?.street))
                return res.status(400).send({ status: false, message: "Street name must be present" });

            if (!addressValid(address.street))
                return res.status(400).send({ status: false, message: "Please enter valid street name" });

            if (address.city) {
                if (!objectValue(address?.city))
                    return res.status(400).send({ status: false, message: "City name must be present" });

                if (!nameRegex(address.city))
                    return res.status(400).send({ status: false, message: "Please enter valid city name" });
            }
            if (address.pincode) {

                if (!objectValue(address?.pincode))
                    return res.status(400).send({ status: false, message: "Pincode must be present" });

                if (!pinValid(address.pincode))
                    return res.status(400).send({ status: false, message: "Pincode is not valid" });
            }
        }

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
            return res.status(400).send({ status: false, message: "Body is empty please provide data " });

        if (!objectValue(userName))
            return res.status(400).send({ status: false, message: "Please enter the userName" });

        if (!objectValue(passWord))
            return res.status(400).send({ status: false, message: "Please enter the passowrd" });

        let User = await UserModel.findOne({ email: userName, password: passWord });

        if (!User)
            return res.status(400).send({ status: false, message: "EmailId or the Password is not correct please give the valid one" });

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