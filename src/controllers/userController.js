const UserModel = require("../models/userModel")
const jwt = require("jsonwebtoken");

const createUser = async function(req,res){

    let data=req.body
    if(!data) return res.status(400).send({status:false,msg:"user details is required"})
    let savedData=await UserModel.create(data)
    return res.status(201).send({status:true,data:savedData})

}
const loginUser = async function (req, res) {
    let data=req.body
    let userName = req.body.email;
    let passWord = req.body.password;
    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Please Provide EmailId & Password" })
    if (!userName) return res.status(400).send({ status: false, msg: "please add the userEmail" })

    if (!passWord) return res.status(400).send({ status: false, msg: "please add the passWord" })
    


    let User = await UserModel.findOne({ email: userName, password: passWord });
    // console.log(author)
    if (!User)
        return res.status(401).send({
            status: false,
            msg: "email id or the password is not correct",
        });

   
    let token = jwt.sign(
        {
            userId: User._id.toString(),
            iat:new Date().getTime(),
             exp:Math.floor(Date.now()/1000)+(60*60)

        },
        "Room-60-Radon"
    );
    res.setHeader("x-api-key", token);
    res.status(200).send({ status: true, data: token });
}

module.exports.createUser = createUser
module.exports.loginUser = loginUser