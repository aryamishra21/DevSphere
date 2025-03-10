const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();

requestRouter.get('/connectionrequest',userAuth,async(req,res)=>{
    try{
        const user=req.user;
        res.send(user.firstName+" is sending a connection request")
    }
    catch(err){
        res.send("ERROR: "+err.message)
    }
})
module.exports=requestRouter