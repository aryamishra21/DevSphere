const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validateSignUpData");
const profileRouter = express.Router();
const bcrypt =require("bcrypt")

profileRouter.get("/profile/view", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
profileRouter.patch("/profile/edit", userAuth, async(req, res) => {
  try {
    validateEditProfileData(req)
    const data=req.body
    const loggedInUser=req.user;
    Object.keys(data).every(k=>loggedInUser[k]=data[k]);
    await loggedInUser.save()
    res.send("Update successful")
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async(req, res) => {
  try {
    const newPassword=req.body.password
    const loggedInUser=req.user;
    loggedInUser["password"]=await bcrypt.hash(newPassword,10)
    await loggedInUser.save()
    res.send("Password updated successfully")
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports=profileRouter