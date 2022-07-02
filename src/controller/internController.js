
const InternModel = require("../model/internModel"); //Importing internmodel
const collegeModel = require("../model/collegeModel"); //Importing collegeModel
const mongoose = require("mongoose") //Importing mongoose

const { isValidEmail, isValidName, isValid, isValidMobile } = require("../validation/validator"); //Importing Validations



// Creation of College via POST /functionup/interns

const createIntern = async function (req, res) {
    try {
        const{name,email,mobile,collegeName}= req.body;
        const data={name,email,mobile,collegeName};
console.log(data)
       // Checking Validation of empty Body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Body should not be empty" })
        }
        // Checking stauts of required fields-- (name,email and mobile) if all will present then code will proceed

        if (!(data.name) || !(data.email) || !(data.mobile) || !(data.collegeName))
            return res.status(400).send({ status: false, msg: "name, email,mobile, collegeId must be required" })

        //Checking presence and format of name 

        if (!isValid(data.name))
            return res.status(400).send({ status: false, msg: "The name Attributes should not be empty" })
        if (!isValidName(data.name))
            return res.status(400).send({ status: false, msg: "Pls Enter Valid Name" })

        //Checking presence, format and uniqueness of email 

        if (!isValid(data.email))
            return res.status(400).send({ status: false, msg: "The email Attributes should not be empty" })
        if (!isValidEmail(data.email))
            return res.status(400).send({ status: false, msg: "Pls Enter Valid email" })

        let checkuniqueemail = await InternModel.findOne({ email:data.email })
        if (checkuniqueemail) return res.status(400).send({ status: false, msg: "This email Already Exists Pls Use Another" })


     
        //Checking presence, uniqueness and format of Mobile number

        if (!isValid(data.mobile))
            return res.status(400).send({ status: false, msg: "The mobile Attributes should not be empty" })
        if (!isValidMobile(data.mobile))
            return res.status(400).send({ status: false, msg: "Pls Enter Valid mobile" })


        let checkunique = await InternModel.findOne({ email:data.email })
        if (checkunique) return res.status(400).send({ status: false, msg: "This email Already Exists Pls Use Another" })

      
      


        let checkuniquemobile = await InternModel.findOne({ mobile: data.mobile })
        if (checkuniquemobile) return res.status(400).send({ status: false, msg: "This mobile Already Exists Pls Use Another" })
        


        if (checkunique && checkuniquemobile) return res.status(400).send({ status: false, msg: "This email or mobile Already Exists Pls Use Another" })


        if(!isValid(data.collegeName))return res.status(400).send({status:false,msg:"collegeName should not be empty"})
      


        // Creating database of InternModel
const checkCollege=await collegeModel.findOne({name:data.collegeName});
console.log(checkCollege)
if(!checkCollege) 
return res.status(400).send({ status: false, data: "this college does not exist" });
collegeId=checkCollege._id

const details={name,email,mobile,collegeId}
        let savedData = await InternModel.create(details);
        res.status(201).send({ status: true, data: savedData });

    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }


}

//  Intern details of College via Get /functionup/collegeDetails

const getCollegeInternDetails = async function (req, res) {
    try {
        let data = req.query.collegeName
        //Checking Validation of empty query
        if (!data)
            return res.status(400).send({ status: false, message: "Please provide data in query" })

        data.toLowerCase() 
        data=data.split(" ").join("")
        
        
        const college = await collegeModel.findOne({ name: data })

        //Checking Validation of College Presence
        if (!college) {
            return res.status(400).send({ status: false, message: "College is not found" })
        }
        const interns = await InternModel.find({ collegeId: college._id }).select({ name: 1, email: 1, mobile: 1 })

        // Handling error of No data presence in interns of requested college
        // if (interns.length == 0) {
        //     return res.status(400).send({ status: false, message: "No interns are found in the given college" })
        // }
        res.status(200).send({ status: true, "data": { "name": college.name, "fullName": college.fullName, "logoLink": college.logoLink, "interns": interns } })

    } catch (err) {

    }
}



module.exports.createIntern = createIntern
module.exports.getCollegeInternDetails = getCollegeInternDetails

//Done