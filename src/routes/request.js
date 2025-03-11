const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
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
        const existingConnection=await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId},
            ]
        }
        )
        if(existingConnection){
           return res.status(400).send({message:"Connection request already exists."})
        }
        const connection=new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        // console.log(connection,user,toUserId)
        await connection.save()
        res.send(status=="interested"?user.firstName+" is sending a connection request":user.firstName+" ignored "+isToUserIdInDB.firstName)
    }
    catch(err){
        res.status(400).send("ERROR: "+err.message)
    }
})


requestRouter.post('/request/review/:status/:requestId',userAuth,async(req,res)=>{
    // api status - accepted ,rejected
    // connectionreq- _id-requestId, toUserId-loggedinuserid, status-interested
    try{
        const loggedInUser=req.user
        const{status,requestId}=req.params
        const ALLOWED_STATUS=["accepted","rejected"]
        if(!ALLOWED_STATUS.includes(status)){
            return res.status(400).json({message: status + " status not allowed!"})
        }
        const connectionRequest=await ConnectionRequest.findOne({_id:requestId,toUserId:loggedInUser._id,status:"interested"})
        console.log(connectionRequest)
        if(!connectionRequest){
            return res.status(404).json({message:" Request not found!"})
        }
        connectionRequest.status=status
        const data=await connectionRequest.save()
        res.json({"message":"Connection Request "+status,data})
    }
    catch(err){
        res.status(400).send("ERROR: "+err.message)
    }
})

module.exports=requestRouter