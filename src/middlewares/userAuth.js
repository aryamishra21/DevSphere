// const adminAuth=(req,res,next)=>{
//     const token='abracadabra'
//     const isAdminAuthorized=token==='abracadabra'
//     if(!isAdminAuthorized){
//         res.status(401).send('Unauthorized')
//     }
//     else{
//         console.log('auth passed !')
//         next()
//     }
// }
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid token");
    }
    const decodedToken = jwt.verify(token, "DEV@SPHERE1.0");
    const { _id } = decodedToken;
    const userData =await User.findById(_id);
    if (!userData) {
      throw new Error("User doesn't exist");
    }
    req.user = userData;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};
module.exports = { userAuth };
