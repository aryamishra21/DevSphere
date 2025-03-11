const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const connectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

const SAFE_USER_DATA="firstName lastName age gender photoUrl about skills"
userRouter.get("/user/request/received", userAuth, async (req, res) => {
  // logged in user toUserId , status="interested"
  try {
    const loggedInUser = req.user;
    const requestReceived = await connectionRequest
      .find({ toUserId: loggedInUser._id, status: "interested" })
      .populate("fromUserId",SAFE_USER_DATA);
    //   .populate("fromUserId",["firstName","lastName","age","gender","photoUrl","about","skills"]);
    if (!requestReceived.length) {
      return res.status(400).json({ message: "No requests found." });
    }
    res.send({ message: "interested users ", requestReceived });
  } catch (err) {
    res.send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    //  loggedin user- toUserId or fromUserId, status="accepted"
    try{
        const loggedInUser=req.user
        const connections=await connectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id, status:"accepted"},
                {toUserId:loggedInUser._id, status:"accepted"}
            ]
        }).populate("fromUserId",SAFE_USER_DATA).populate("toUserId",SAFE_USER_DATA)
        if(!connections){
            return res.status(400).json({message:"No connections found!"})
        }
        const data=connections.map((row)=>{
            if(row.fromUserId.toString()===loggedInUser._id){
                return row.toUserId
            }
            return row.fromUserId
        })
        res.send(data)
    }
    catch(err){
        res.send("ERROR: "+err.message)
    }
})

module.exports = userRouter;


