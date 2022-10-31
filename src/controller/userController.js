const UserModel = require('../model/userModel.js')

const jwt = require("jsonwebtoken");
const { objectValue, forBody, nameRegex, mailRegex, passwordRegex } = require('../validation/validation.js')

const createUser = async function (req, res) {
    try {

        if (!forBody(req.body)) {
            return res.status(400).send({ status: false, message: "Body should not remain empty" })
        };
        const { name, email, password } = req.body;
        const data = { name, email, password };
        if (!objectValue(name))
            return res.status(400).send({ status: false, message: "Name must be present" });

        if (!nameRegex(name))
            return res.status(400).send({ status: false, message: "Please provide valid name, it should not contains any special characters and numbers" });

        const emailId = await UserModel.findOne({ email: email });

        if (emailId)
            return res.status(400).send({ status: false, message: "EmailId already taken" });

        if (!objectValue(email))
            return res.status(400).send({ status: false, message: "EmailId must be present" });

        if (!mailRegex(email))
            return res.status(400).send({ status: false, message: "Please enter valid email" });

        const checkPassword = await UserModel.findOne({ password: password });
        if (!objectValue(password))
            return res.status(400).send({ status: false, message: "Password must be present" });

        if (!passwordRegex(password))
            return res.status(400).send({ status: false, message: "Please enter a password which contains min 8 letters & max 15 letters, at least a symbol, upper and lower case letters and a number" });



        let savedUser = await UserModel.create(data)
        res.status(201).send({ status: true, data: savedUser })
    }

    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

const logInUser = async function (req, res) {
    try {
        if (!forBody(req.body)) {
            return res.status(400).send({ status: false, message: "Body should not remain empty" })
        };
        let { email, password } = req.body


        if (!objectValue(email))
            return res.status(400).send({ status: false, message: "EmailId must be present" });


        if (!objectValue(password))
            return res.status(400).send({ status: false, message: "Password must be present" });


        let user = await UserModel.findOne({ email: email, password: password })

        if (!user)
            return res.status(400).send({ status: false, message: "EmailId or the Password is not correct please give the valid one" });

        let token = jwt.sign({
            userId: user._id.toString(),
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (60 * 60)
        },
            "task"
        )
        res.setHeader("x-api-key", token);
        res.status(200).send({ status: true, message: "Success", data: token });
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }

}


module.exports.createUser = createUser
module.exports.logInUser = logInUser