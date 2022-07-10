const mongoose = require('mongoose');

const isValidObjectId = (objectId) => {
    if(mongoose.Types.ObjectId.isValid(objectId)) return true;
    return false;
  };

const objectValue = (value) => {
    if(typeof value === "undefined" || value === "null") return false;
    if(typeof value === "String" && value.trim().length === 0) return false;
    return true;
    
} 

const forBody = (value) => {
    if(Object.keys(value).length === 0) return false;
    return true;
}

const nameRegex = (value) => {
    let nameRegex = /^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/;
    if(nameRegex.test(value))
    return true;
}

const mobileRegex = (value) => {
    let phoneRegex = /^([+]\d{2})?\d{10}$/;
    // if (typeof value == "String" && value.trim().length == 0) return 'Mobile number cannot be empty'
    // if (value.startsWith("0") || value.startsWith("1") || value.startsWith("2") || value.startsWith("3") || value.startsWith("4") || value.startsWith("5")) return `Mobile number cannot start with ${value[0]}`
    // if (value.length != 10) return 'Mobile number must be 10 digits'
    if (phoneRegex.test(value)) //return "Mobile number can only contains numbers";
     return true;
}

const mailRegex = (value) => {
    let mailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    if(mailRegex.test(value))
    return true;
}

 const passwordRegex = (value) => {
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
    if(passwordRegex.test(value)) 
    return true;
 }

const isbnIsValid = (value) => {
    let isbnRegex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;
    if(isbnRegex.test(value))
    return true;
}

const pinValid = (value) => {
    let pinregex = /^(\d{4}|^\d{6})$/;
    if(pinregex.test(value))
    return true;
}

const dateFormate = (value) => {
    let dateRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
    if(dateRegex.test(value)) 
    return true;
}

module.exports = {isValidObjectId, objectValue,forBody,nameRegex,mailRegex,mobileRegex,passwordRegex, isbnIsValid, pinValid, dateFormate}

