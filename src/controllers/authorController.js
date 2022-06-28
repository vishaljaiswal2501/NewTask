
const AuthorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken");

const createAuthor = async function (req, res) {
    try {


        let data = req.body
        let checkPassword = data.password
        let checkEmailId = data.email
        let firstName = data.fname
        let lastName = data.lname
        let title = data.title
        let authorId=data.authorId
        let mailRegex = (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
        let passwordRegex = (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);
        let strRegex = /^\w[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "fname,lname,title,email,password Not FOUND" })

        if (typeof (firstName) != 'string' || !firstName|| !strRegex.test(firstName)) return res.status(400).send({ status: false, msg: "fname is must in the valid formate" })

        if (typeof (lastName) != 'string' || !lastName || !strRegex.test(lastName)) return res.status(400).send({ status: false, msg: "lname is must in the valid formate" })

        if (!title || title != ("Mr" || "Mrs" || "Miss") ) {
            return res.status(400).send({
                status: false,
                msg: "Title is must with Mr, Mrs, Miss"
            })
        }
        if (!checkEmailId || !mailRegex.test(checkEmailId)) {
            return res.status(400).send({
                status: false,
                msg: "Please add the email with valid format"
            })
        }
        if (!checkPassword || !passwordRegex.test(checkPassword)) {
            return res.status(400).send({
                status: false,
                msg: "Please add the password with valid format"
            })
        }
        let mail = await AuthorModel.findOne({ email: checkEmailId })
        if (mail) {
            return res.status(400).send({
                status: false,
                msg: "this email id already used"
            })
        }

        


        let savedData = await AuthorModel.create(data)
        res.status(201).send({ msg: savedData })
    }


    catch (error) {
        console.log("This is the Error", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }

}

const loginUser = async function (req, res) {
    let data=req.body
    let userName = req.body.email;
    let passWord = req.body.password;
    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Please Provide EmailId & Password" })
    if (!userName) return res.status(400).send({ status: false, msg: "please add the userEmail" })

    if (!passWord) return res.status(400).send({ status: false, msg: "please add the passWord" })
    


    let author = await AuthorModel.findOne({ email: userName, password: passWord });
    // console.log(author)
    if (!author)
        return res.status(401).send({
            status: false,
            msg: "email id or the password is not correct",
        });

    // let user = await AuthorModel.findOne({ emailId: userName, password: passWord });


    // Once the login is successful, create the jwt token with sign function
    // Sign function has 2 inputs:
    // Input 1 is the payload or the object containing data to be set in token
    // The decision about what data to put in token depends on the business requirement
    // Input 2 is the secret
    // The same secret will be used to decode tokens
    let token = jwt.sign(
        {
            userId: author._id.toString(),
            userName: author.email,
            passWord: author.password

        },
        "Room-8-Radon"
    );
    res.setHeader("x-api-key", token);
    res.status(200).send({ status: true, data: token });
}



module.exports.createAuthor = createAuthor
module.exports.loginUser = loginUser

