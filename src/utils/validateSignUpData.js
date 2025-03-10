const validator=require('validator')
const User=require("../models/user")
const validateSignUpData=(req)=>{
    const {firstName,lastName,emailId,password}=req.body

    if(!firstName || !lastName){
        throw new Error("Name is not valid!")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid!")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Enter a strong password")
    }
}

const validateEditProfileData=(req)=>{
    const data=req.body
    ALLOWED_UPDATES=["photoUrl","about","skills","gender","age"]
    const isUpdateAllowed=Object.keys(data).every(k=>ALLOWED_UPDATES.includes(k))
    if(!isUpdateAllowed){
      throw new Error("Update not allowed")
    }
}
module.exports={validateSignUpData,validateEditProfileData}