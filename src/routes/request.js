const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const connectionRequest = require("../models/connectionRequest");
const User=require("../models/user")
requestRouter.post('/request/send/:status/:toUserId',userAuth,async(req,res)=>{
    try{
        const user=req.user;
        const fromUserId=user._id;
        const toUserId=req.params.toUserId
        const status=req.params.status
        const ALLOWED_STATUS=["ignored","interested"]
        // status type is not allowed
        if(!ALLOWED_STATUS.includes(status)){
            return res.status(400).json({"message":"Connection type : "+status+" is not Allowed"})
        }
        // toUserId present in db or not
        const isToUserIdInDB=await User.findById(toUserId)
        if(!isToUserIdInDB){
            res.status(400).send("User not found.")
        }
        // to check if connection request already exists
        const existingConnection=await connectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId},
            ]
        }
        )
        if(existingConnection){
           return res.status(400).send({message:"Connection request already exists."})
        }
        const connection=new connectionRequest({
            fromUserId,
            toUserId,
            status
        })
        console.log(connection,user,toUserId)
        await connection.save()
        res.send(status=="interested"?user.firstName+" is sending a connection request":user.firstName+" ignored "+isToUserIdInDB.firstName)
    }
    catch(err){
        res.send("ERROR: "+err.message)
    }
})
module.exports=requestRouter