const mongoose = require('mongoose');

const isValidObjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId);
  };

const objectValue = (value) => {
    if(typeof value === undefined || value === null) return false;
    if(typeof value === "string" && value.trim().length === 0) return false;
    return true;
    
} 

const keyValue = (value) => {
    if(Object.keys(value).length === 0) return false;
    return true;
}

const nameRegex = (value) => {
    let nameRegex = /^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/;
    if(nameRegex.test(value))
    return true;
}

const mobileRegex = (value) => {
    let mobileRegex =  /^[+0]{0,2}(91)?[0-9]{10}$/;
    if(mobileRegex.test(value))
    return true;
}

const mailRegex = (value) => {
    let mailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    if(mailRegex.test(value))
    return true;
}

 const passwordRegex = (value) => {
    let passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/;
    if(passwordRegex.test(value)) 
    return true;
 }

const isbnIsValid = (value) => {
    let isbnRegex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;
    if(isbnRegex.test(value))
    return true;
}


module.exports = {isValidObjectId, objectValue,keyValue,nameRegex,mailRegex,mobileRegex,passwordRegex, isbnIsValid}

