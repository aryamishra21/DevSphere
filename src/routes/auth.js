const express=require("express");
const {validateSignUpData} = require("../utils/validateSignUpData");
const authRouter=express.Router();
const User=require('../models/user')
const bcrypt=require('bcrypt')
authRouter.post('/signup',async(req,res)=>{
    try{
        validateSignUpData(req);
        const {firstName,lastName,emailId,password}=req.body;
        const isEmailInDB=await User.findOne({emailId:emailId})
        if(isEmailInDB){
            throw new Error("User already exists.")
        }
        const passwordHash=await bcrypt.hash(password,10)
        const user=new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash
        })
        await user.save()
        res.send('User created successfully')
    }
    catch(err){
        res.status(400).send("ERROR : "+ err.message)
    }
})

authRouter.post('/login',async(req,res)=>{
    try{
        const {emailId,password}=req.body;
        const userInDB=await User.findOne({emailId:emailId})
        if(!userInDB){
            throw new Error("Invalid credentials.")
        }
        const checkPassword=await userInDB.validatePassword(password)
        if(!checkPassword){
            throw new Error("Invalid credentials.")
        }
        else{
            const token=await userInDB.getJWT()
            res.cookie("token",token,{expires:new Date(Date.now()+8*3600000)})
            res.send(userInDB)
        }
    }
    catch(err){
        res.status(400).send('ERROR: '+err.message)
    }
})

authRouter.post('/logout',async(req,res)=>{
    res.cookie("token",null,{expires:new Date(Date.now())})
    res.send("Logged out successfully")
})
module.exports=authRouter