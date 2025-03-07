const express = require("express");
const app = express();
const connectDB=require('./config/database')
const User=require('./models/user')

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
app.post('/signup',async(req,res)=>{
    console.log(req.body)
    // creates new instance of user model
    const user=new User(req.body)
    try{
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
