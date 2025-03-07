const mongoose=require('mongoose')
const dbName='devsphere'
const db_url=`mongodb+srv://arya:spiderman%402001@nodearya.8z1i4.mongodb.net/${dbName}`
const connectDB=async()=>{
    await mongoose.connect(db_url)
}
module.exports=connectDB;