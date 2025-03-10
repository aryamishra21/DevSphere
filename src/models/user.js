const mongoose = require("mongoose");
const validator=require("validator")
const jwt=require("jsonwebtoken");
const bcrypt =require("bcrypt")

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      // validate:[validateEmail,'Please provide a valid email address']
      validate(value){
        if(!validator.isEmail(value)){
          throw new Error("Invalid email address: "+value);
        }
      }
    },
    password: {
      type: String,
      required: true,
      validate(value){
        if(!validator.isStrongPassword(value)){
          throw new Error("Enter a strong password "+value);
        }
      }
    },
    age: {
      type: Number,
      min: 10,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: "{VALUE} is not valid",
      },
      // validate(value){
      //     if(!['male','female','others'].includes(value)){
      //         throw new Error('Gender data is not valid ')
      //     }
      // }
    },
    photoUrl: {
      type: String,
      default:
        "https://p1.hiclipart.com/preview/169/1023/715/login-logo-user-users-group-customer-education-button-typeface-credential-png-clipart.jpg",
        validate(value){
          if(!validator.isURL(value)){
            throw new Error("Invalid Image URL : "+value);
          }
        }
    },
    about: {
      type: String,
      default: "This is a default about of the user!",
    },
    skills: {
      type: [String],
      // validate: {
      //   validator: function (skillsArray) {
      //     return skillsArray.length <= 10; // Ensures max length is 10
      //   },
      //   message: "Skills should be less than or equal to 10"
      // }
    },
  },
  {
    timestamps: true,
  }
);
userSchema.methods.getJWT=async function (){
    const user=this;
    const token=await jwt.sign({_id:user.id},"DEV@SPHERE1.0",{expiresIn:"1d"})
    return token;
}
userSchema.methods.validatePassword=async function(passwordInputByUser){
  const user=this;
  const passwordHash=user.password
  const isPasswordValid=await bcrypt.compare(passwordInputByUser, passwordHash)
  return isPasswordValid
}
module.exports = mongoose.model("User", userSchema);
