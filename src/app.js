const express = require("express");
const app = express();
const connectDB=require('./config/database')
const User=require('./models/user');
const user = require("./models/user");
const validateSignUpData = require("./utils/validateSignUpData");
const bcrypt =require("bcrypt")
connectDB().then(()=>{
    console.log('db connected !')
    app.listen(1262, () => {
      console.log("server started at 1262");
    });
})
.catch((err)=>{
    console.log('db cannot be connected ',err)
})
app.use(express.json())    // converts json from request to js object      used to convert body to pass to user model to save in db

// create user
app.post('/signup',async(req,res)=>{
    console.log(req.body)
    // creates new instance of user model
    // const user=new User(req.body)
    
    try{ 
        //validation of data
        validateSignUpData(req)
        const {firstName,lastName,emailId,password}=req.body
        const checkEmail=await User.findOne({emailId:emailId})
        if(checkEmail){
            throw new Error("User already exists")
        }
        
        //Encrypt the password
        const passwordHash= await bcrypt.hash(password, 10);
        
        const user=new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash
        })
        await user.save()
        res.send('User added successfully')
    }
    catch(err){
        res.status(400).send('Error occured while adding user: '+ err.message)
    }
    // const user=new User({
    //     firstName:'Aa',
    //     lastName:'ra',
    //     emailId:'ar@gmail.com'
    // })
    // await user.save()
    // res.send('User created successfully')
})

app.post('/login',async(req,res)=>{
    const {emailId, password}=req.body
    try{
        const userinDB=await User.findOne({emailId:emailId})
        console.log(userinDB)
        if(!userinDB){
            throw new Error("Invalid Credentials")
        }
        const checkPassword=await bcrypt.compare(password, userinDB.password)
        if(checkPassword){
            res.send("logged in successfully")
        }
        else{
            throw new Error("Invalid Credentials")
        }
    }
    catch(err){
        res.send("ERROR: "+err.message)
    }
})

// find user
app.get('/user',async (req,res)=>{
    const userEmail=req.body.emailId;
    try{
        const users=await User.find({emailId:userEmail})
        if (users.length===0){
            res.status(404).send('User not found')
        }
        else{
            res.send(users)
        }
    }
    catch{
        res.status(400).send('Something went wrong')
    }
})


// feed get all users
app.get('/feed',async(req,res)=>{
    try{
        const allUsers=await User.find({})
        if (allUsers.length===0){
            res.status(404).send('No users found')
        }
        else{
            res.send(allUsers)
        }
    }
    catch{
        res.status(400).send('Something went wrong')
    }
})


// delete user by id
app.delete('/user',async(req,res)=>{
    // const emailid=req.body.emailId
    const id=req.body.userId
    try{
        // await User.findByIdAndDelete({_id:id})
        await User.findByIdAndDelete(id)
        //delete by email id
        // await User.findOneAndDelete({"emailId":emailid}) or deleteOne
        res.send('User deleted successfully')
    }
    catch{
        res.status(400).send('Something went wrong')
    }
})

// update user 
app.patch('/user/:userId',async(req,res)=>{
    const id=req.params?.userId
    const data=req.body
    try{
        // restricting important field update
        ALLOWED_UPDATES=["photoUrl","about","skills","gender","age"]
        const isUpdateAllowed=Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k))
        if(!isUpdateAllowed){
            throw new Error("Update not allowed")
        }
        if(data?.about.length>200){
            throw new Error("About should be less than 200 words")
        }
        if(data?.skills.length>10){
            throw new Error("Skills should be less than or equal to 10")
        }
        const user=await User.findByIdAndUpdate({'_id':id},data,{returnDocument:"after",runValidators:true})
        console.log(user)
        res.send('User updated successfully')
        // user.findOneAndUpdate User.updateOne User.updateMany
    }
    catch(err){
        res.status(400).send('Something went wrong: '+err.message)
    }
})




// app.use('/',(err,req,res,next)=>{
//     if(err){
//         res.send('Error occured')
//     }
// })



// request handler // use will go to the first
// app.use('/user',(req,res)=>{
//     res.send({'name':'jon','age':32})
// })
// app.get('/ab?c',(req,res)=>{
//     res.send('ab,ac b is optional')
// })
// app.get('/ab+c',(req,res)=>{
//     res.send('b can be many times abbbbbbc')
// })
// app.get('/ab*c',(req,res)=>{
//     res.send('anything can be between ab and c /ababracadabrac')
// })
// app.get(/a/,(req,res)=>{
//     res.send('regex should be present other than that anything')
// })
// app.get(/.*fly$/,(req,res)=>{
//     res.send('fly should be at end /anythingfly')
// })

// app.get('/user',(req,res)=>{
//     console.log(req.query)
//     //http://localhost:1262/user?md=4&p=4   //{ md: '4', p: '4' }
// })
// app.get('/user/:userId/:name',(req,res)=>{
//     console.log(req.params)
//     //http://localhost:1262/user/343 { userId: '343', name: 'arya' }
//     res.send({'name':'jon','age':32})
// })
// app.get('/user',(req,res)=>{
//     res.send({'name':'jon','age':32})
// })
// app.post('/user',(req,res)=>{
//     res.send('data saved to DB')
// })
// app.delete('/user',(req,res)=>{
//     res.send('ata deleted from DB')
// })
// app.put('/user',(req,res)=>{
//     res.send({'name':'tedd','age':23})
// })
// app.patch('/user',(req,res)=>{
//     res.send({'name':'mac'})
// })
// app.use('/route',(req,res,next)=>{
//     console.log('rh1')
//     next()
// },
// (req,res,next)=>{
//     console.log('rh2')
//     next()
// },(req,res,next)=>{
//     console.log('rh3')
//     res.send('response given -3 ')
//     next()
// },(req,res,next)=>{
//     console.log('rh4')
//     next()
// },(req,res)=>{
//     res.send('response given -5 ')
//     console.log('rh5')

// }
// )

// const {adminAuth}=require('./middlewares/auth')
// app.use('/admin',adminAuth)
// app.get('/admin/getAllData',(req,res)=>{
//     throw new Error('error!')
//     res.send('logged in successfully')
// })
// app.get('/admin/deleteAdmin',(req,res)=>{
//         res.send('Admin deleted successfully')
// })

// const userAuth=(req,res,next)=>{
//     const token='user123'
//     const isUserAuthorized=!!(token==='user123')
//     if(!isUserAuthorized){
//         res.status(401).send('User not Authorized')
//     }
//     else{
//         next()
//     }
// }
// app.get('/user/login',(res,req)=>{
//     res.send('login here !')
//     console.log('login here!')
// })
// app.get('/user',userAuth,(res,req)=>{
//     res.send('loggen in successfully !')
// })
// app.use('/',(err,req,res,next)=>{
//     if(err){
//         res.status(500).send('error occured')
//     }
// })
