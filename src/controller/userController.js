const userModel = require("../models/userModel");
const {
  isValidRequest,isValidString,isValidName,isValidMail,isValidPhone,isValidPassword,isValidPincode,isValidId,} = require("../validator/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { uploadFiles } = require("../upload/upload");
const mongoose = require("mongoose");

const createUser = async function (req, res) {
  try {
    let { fname, lname, email, phone, password, address } = req.body;
    let userData = {};
    let profileImage = req.files;
    if (!isValidRequest(req.body)) {
      return res.status(400).send({ status: false, message: "Enter valid Input" });
    }
    if (!fname) {
      return res.status(400).send({ status: false, message: "First Name is required" });
    }
   
    if (!isValidString(fname) || !isValidName(fname)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter first name in proper format" });
    }
    userData.fname = fname;

    if (!lname) {
      return res
        .status(400)
        .send({ status: false, message: "Last Name is required" });
    }
    
    if (!isValidString(lname) || !isValidName(lname)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter Last name in proper format" });
    }
    userData.lname = lname;

    if (!email) {
      return res
        .status(400)
        .send({ status: false, message: "Email is required" });
    }
    
    if (!isValidString(email) || !isValidMail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter email in proper format" });
    }
    const isDuplicateEmail = await userModel.findOne({ email });
    if (isDuplicateEmail) {
      return res
        .status(409)
        .send({ status: false, message: `${email} emailId already in use` });
    }
    userData.email = email;

    //Profile Image validation
    if (profileImage.length > 0) {
      let match = /\.(jpeg|png|jpg)$/.test(profileImage[0].originalname);
      if (match == false) {
        return res.status(400).send({  status: false,  message: "Profile Image is required in JPEG/PNG/JPG format",
        });
      }
      let uploadedFileURL = await uploadFiles(profileImage[0]);
      userData.profileImage = uploadedFileURL;
    } else {
      return res
        .status(400)
        .send({ status: false, message: "Profile Image is required" });
    }

    //Phone number validation
    if (!phone) {
      return res
        .status(400)
        .send({ status: false, message: "Phone number is required" });
    }
    if ( !isValidPhone(phone)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter phone in valid format" });
    }
    let userPhone = await userModel.find();
    phone = phone.toString();

    //incase phone number is starting from +91 in body
    if (phone.startsWith("+91", 0) == true) {
      let newPhone = phone.substring(4, 14);
      for (i = 0; i < userPhone.length; i++) {
        if (userPhone[i].phone.startsWith("+91")) {
          if (userPhone[i].phone.startsWith(newPhone, 4) == true) {
            return res.status(409).send({
              status: false,
              message: `${phone} phone number is already in use`,
            });
          }
        }

        if (userPhone[i].phone.startsWith(0)) {
          if (userPhone[i].phone.startsWith(newPhone, 1) == true) {
            return res.status(409).send({
              status: false,
              message: `${phone} phone number is already in use`,
            });
          }
        }

        if (userPhone[i].phone.startsWith(newPhone, 0) == true) {
          return res.status(409).send({
            status: false,
            message: `${phone} phone number is already in use`,
          });
        }
      }
      userData.phone = phone;
    }

    //incase phone number is starting from 0 in body
    if (phone.startsWith("0", 0) == true) {
      for (i = 0; i < userPhone.length; i++) {
        newPhone = phone.substring(1, 12);
        if (userPhone[i].phone.startsWith("+91")) {
          if (userPhone[i].phone.startsWith(newPhone, 4) == true) {
            return res.status(409).send({
              status: false,
              message: `${phone} phone number is already in use`,
            });
          }
        }

        if (userPhone[i].phone.startsWith(0)) {
          if (userPhone[i].phone.startsWith(newPhone, 1) == true) {
            return res.status(409).send({
              status: false,
              message: `${phone} phone number is already in use`,
            });
          }
        }

        if (userPhone[i].phone.startsWith(newPhone, 0) == true) {
          return res.status(409).send({
            status: false,
            message: `${phone} phone number is already in use`,
          });
        }
      }
      userData.phone = phone;
    }

    //incase there is just the phone number without prefix
    if (phone) {
      for (i = 0; i < userPhone.length; i++) {
        if (userPhone[i].phone.startsWith("+91")) {
          if (userPhone[i].phone.startsWith(phone, 4) == true) {
            return res.status(409).send({
              status: false,
              message: `${phone} phone number is already in use`,
            });
          }
        }

        if (userPhone[i].phone.startsWith(0)) {
          if (userPhone[i].phone.startsWith(phone, 1) == true) {
            return res.status(409).send({
              status: false,
              message: `${phone} phone number is already in use`,
            });
          }
        }

        if (userPhone[i].phone.startsWith(phone, 0) == true) {
          return res.status(409).send({
            status: false,
            message: `${phone} phone number is already in use`,
          });
        }
      }
      userData.phone = phone;
    }

    //Password validation
    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "Password is required" });
    }
    if (!isValidString(password) || !isValidPassword(password)) {
      return res.status(400).send({
        status: false,
        message:
          "Password should contain min 8 and max 15 character with a number and a special character",
      });
    }

    //Encrypting password
    const encryptPassword = await bcrypt.hash(password, 10);
    console.log(encryptPassword);
    userData.password = encryptPassword;

    //Address validation

    if (!address) {
      return res
        .status(400)
        .send({ status: false, message: "address is required" });
    }
    if (!isValidRequest(address)) {
      return res
        .status(400)
        .send({ status: false, message: "Address should include fields" });
    }

    let { shipping, billing } = address;
    // shipping validation
    if (!isValidRequest(shipping)) {
      return res
        .status(400)
        .send({ status: false, message: "Shipping address is required" });
    }
    //Street validation
    if (!isValidString(shipping.street)) {
      return res.status(400).send({
        status: false,
        message: "Enter valid Street, street is required",
      });
    }
    // //City validation
    if (!isValidString(shipping.city)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid City, city is required" });
    }
    //Pincode validation
    if (!isValidPincode(shipping.pincode)) {
      return res.status(400).send({
        status: false,
        message: "Enter valid Pincode, pincode is required",
      });
    }

    //Billing Validation
    if (!isValidRequest(billing)) {
      return res
        .status(400)
        .send({ status: false, message: "Billing address is required" });
    }
    //Street validation
    if (!isValidString(billing.street)) {
      return res.status(400).send({
        status: false,
        message: "Enter valid Street, street is required",
      });
    }
    //City validation
    if (!isValidString(billing.city)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid City, city is required" });
    }
    //Pincode validation
    if (!isValidPincode(billing.pincode)) {
      return res.status(400).send({
        status: false,
        message: "Enter valid Pincode, pincode is required",
      });
    }

    userData.address = address;
    const user = await userModel.create(userData);
    return res
      .status(201)
      .send({ status: true, message: "User created successfully", data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, message: error.message });
  }
};

const loginUser = async function (req, res) {
  try {
    if (!isValidRequest(req.body)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide login details" });
    }
    let { email, password } = req.body;

    // validating the email
    if (!email) {
      return res
        .status(400)
        .send({ status: false, message: "email is required" });
    }
    if (!isValidString(email) || !isValidMail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Entered mail ID is not valid" });
    }

    // validating the password
    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "password is required" });
    }
    if (!isValidPassword(password))
      return res
        .status(400)
        .send({ status: false, message: "Entered Passwrod is not valid" });

    let user = await userModel.findOne({
      email: email,
    });

    if (!user)
      return res.status(400).send({
        status: false,
        message: "Email does not exist",
      });
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(400)
        .send({ status: false, message: "Entered Passwrod is incorrect" });
    }

    // JWT creation
    let token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      "productManagement/13/dfis",
      { expiresIn: "24h" }
    );
    res.header("x-api-key", token);
    return res.status(200).send({
      status: true,
      message: "User login successfull",
      data: { userId: user._id, token: token },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getUser = async function (req, res) {
  try {
    const userFound = await userModel.findOne({ _id: req.user._id });
    if (!userFound) {
      return res.status(404).send({ status: false, message: "No userFound" });
    }
    return res
      .status(200)
      .send({ status: true, message: "User profile details", data: userFound });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, message: error.message });
  }
};

const updateUserProfile = async function (req, res) {
  try {
    //validating the requset body
    if (!isValidValue(req.body)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid input" });
    }

    //Parsing requestbody into json
    let requestBody = JSON.parse(JSON.stringify(req.body));

    //Destructuring the field of body
    let { fname, lname, email, phone, password, address } = requestBody;

    //Storing authorised user in userdata
    let userData = req.user;

    let profileImage = req.files;

    //validating the fname
    if (requestBody.hasOwnProperty("fname") ) {
      fname = fname.trim();

      if (!isValidString(fname) || !isValidName(fname)) {
        return res.status(400).send({
          status: false,
          message: "Enter first name in proper format",
        });
      }
      userData.fname = fname;
    }

    //validating the lname
    if (requestBody.hasOwnProperty("lname")) {
      lname = lname.trim();

      if (!isValidString(lname) || !isValidName(lname)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter lname in proper format" });
      }
    }
    userData.lname = lname;

    //validating the email
    if (requestBody.hasOwnProperty("email")) {
      email = email.trim();

      if (!isValidString(email) || !isValidMail(email)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter email in proper format" });
      }
      const isDuplicateEmail = await userModel.find({ email });
      if (isDuplicateEmail) {
        return res
          .status(409)
          .send({ status: false, message: `${email} emailId already in use` });
      }
    }
    userData.email = email;

    //Profile Image validation
    if (profileImage) {
      if (profileImage.length > 0) {
        console.log(profileImage[0]);
        let match = /\.(jpeg|png|jpg)$/.test(profileImage[0].originalname);
        if (match == false) {
          return res.status(400).send({
            status: false,
            message: "Profile Image is required in JPEG/PNG/JPG format",
          });
        }
        let uploadedFileURL = await uploadFiles(profileImage[0]);
        console.log(uploadedFileURL);
        userData.profileImage = uploadedFileURL;
      }
    }

    //Phone number validation
    if (requestBody.hasOwnProperty("phone")) {
      if (!isValidString(phone) || !isValidPhone(phone)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter phone in valid format" });
      }
      let userPhone = await userModel.find();
      phone = phone.toString();

      //incase phone number is starting from +91 in body
      if (phone.startsWith("+91", 0) == true) {
        let newPhone = phone.substring(4, 14);
        for (i = 0; i < userPhone.length; i++) {
          if (userPhone[i].phone.startsWith("+91")) {
            if (userPhone[i].phone.startsWith(newPhone, 4) == true) {
              return res.status(409).send({
                status: false,
                message: `${phone} phone number is already in use`,
              });
            }
          }

          if (userPhone[i].phone.startsWith(0)) {
            if (userPhone[i].phone.startsWith(newPhone, 1) == true) {
              return res.status(409).send({
                status: false,
                message: `${phone} phone number is already in use`,
              });
            }
          }

          if (userPhone[i].phone.startsWith(newPhone, 0) == true) {
            return res.status(409).send({
              status: false,
              message: `${phone} phone number is already in use`,
            });
          }
        }
        userData.phone = phone;
      }

      //incase phone number is starting from 0 in body
      if (phone.startsWith("0", 0) == true) {
        for (i = 0; i < userPhone.length; i++) {
          newPhone = phone.substring(1, 12);
          if (userPhone[i].phone.startsWith("+91")) {
            if (userPhone[i].phone.startsWith(newPhone, 4) == true) {
              return res.status(409).send({
                status: false,
                message: `${phone} phone number is already in use`,
              });
            }
          }

          if (userPhone[i].phone.startsWith(0)) {
            if (userPhone[i].phone.startsWith(newPhone, 1) == true) {
              return res.status(409).send({
                status: false,
                message: `${phone} phone number is already in use`,
              });
            }
          }

          if (userPhone[i].phone.startsWith(newPhone, 0) == true) {
            return res.status(409).send({
              status: false,
              message: `${phone} phone number is already in use`,
            });
          }
        }
        userData.phone = phone;
      }

      //incase there is just the phone number without prefix
      if (phone) {
        for (i = 0; i < userPhone.length; i++) {
          if (userPhone[i].phone.startsWith("+91")) {
            if (userPhone[i].phone.startsWith(phone, 4) == true) {
              return res.status(409).send({
                status: false,
                message: `${phone} phone number is already in use`,
              });
            }
          }

          if (userPhone[i].phone.startsWith(0)) {
            if (userPhone[i].phone.startsWith(phone, 1) == true) {
              return res.status(409).send({
                status: false,
                message: `${phone} phone number is already in use`,
              });
            }
          }

          if (userPhone[i].phone.startsWith(phone, 0) == true) {
            return res.status(409).send({
              status: false,
              message: `${phone} phone number is already in use`,
            });
          }
        }
        userData.phone = phone;
      }
    }

    //validating the password
    if (requestBody.hasOwnProperty("password")) {
      if (!isValidPassword(password)) {
        return res.status(400).send({
          status: false,
          message:
            "Password should contain min 8 and max 15 character with a number and a special character",
        });
      }

      //Encrypting password
      const encryptPassword = await bcrypt.hash(password, 10);
      console.log(encryptPassword);
      userData.password = encryptPassword;
    }

    // Address validation

    if (requestBody.hasOwnProperty("address")) {
      //Parsing address into json
      address = JSON.parse(JSON.stringify(address));
      let { shipping, billing } = address;

      //Shipping validation
      if (address.hasOwnProperty("shipping")) {
        //Parsing shipping into json
        shipping = JSON.parse(JSON.stringify(shipping));
        let { street, city, pincode } = shipping;
        //Shipping street validation
        if (shipping.hasOwnProperty("street")) {
          if (!isValidString(street)) {
            return res
              .status(400)
              .send({ status: false, message: "Enter valid street " });
          }
          userData.address.shipping.street = street;
        }

        //Shipping city validation
        if (shipping.hasOwnProperty("city")) {
          if (!isValidString(city)) {
            return res
              .status(400)
              .send({ status: false, message: "Enter valid city" });
          }
          userData.address.shipping.city = city;
        }
        //Shipping pincode validation
        if (shipping.hasOwnProperty("pincode")) {
          if (!isValidPincode(pincode)) {
            return res
              .status(400)
              .send({ status: false, message: "Enter valid pincode" });
          }
          userData.address.shipping.pincode = pincode;
        }
      }

      // Billing validation
      if (address.hasOwnProperty("billing")) {
        billing = JSON.parse(JSON.stringify(billing));
        // Billing street validation
        let { street, city, pincode } = billing;

        if (billing.hasOwnProperty("street")) {
          if (!isValidString(street)) {
            return res
              .status(400)
              .send({ status: false, message: "Enter valid street" });
          }
          userData.address.billing.street = street;
        }

        // Billing city validation
        if (billing.hasOwnProperty("city")) {
          if (!isValidString(city)) {
            return res
              .status(400)
              .send({ status: false, message: "Enter valid city" });
          }
          userData.address.billig.city = city;
        }

        // Billing pincode validation
        if (billing.hasOwnProperty("pincode")) {
          if (!isValidPincode(pincode)) {
            return res
              .status(400)
              .send({ status: false, message: "Enter valid pincode" });
          }

          userData.address.billing.pincode = pincode;
        }
      }
    }

    // Updating user details

    let updatedData = await userModel.findOneAndUpdate(
      { _id: req.user._id },
      { $set: userData },
      { new: true }
    );
    if (!updatedData) {
      return res
        .status(404)
        .send({ status: false, message: "User does not exist with this Id" });
    } else {
      res.status(200).send({
        status: true, 
        message: "User profile updated",
        data: updatedData,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { createUser, loginUser, getUser, updateUserProfile };
