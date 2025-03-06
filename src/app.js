console.log('init')
const express=require('express')
const app=express()

// request handler
app.use('/',(req,res)=>{
    res.send('HI there1245!')
})
app.use('/test',(req,res)=>{
    res.send('Test path')
})
app.listen(1262,()=>{
    console.log('server started at 1262')
})