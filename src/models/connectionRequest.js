const mongoose=require("mongoose")

const connectionSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.ObjectId
    },
    toUserId:{
        type:mongoose.Schema.ObjectId
    },
    status:{
        type:String,
        enum:{
            values:['accepted','rejected','ignored','interested'],
            message: "{VALUE} is not valid",
        }
    }
})
//compound index to optimize search if both fields are used in a query
connectionSchema.index({fromUserId:1, toUserId:1})
connectionSchema.pre("save",function (next){
    const connectionRequest=this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself!")
    }
    next()
})
module.exports=mongoose.model('connectionRequest',connectionSchema)