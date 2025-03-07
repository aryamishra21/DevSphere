const adminAuth=(req,res,next)=>{
    const token='abracadabra'
    const isAdminAuthorized=token==='abracadabra'
    if(!isAdminAuthorized){
        res.status(401).send('Unauthorized')
    }
    else{
        console.log('auth passed !')
        next()
    }
}
module.exports={adminAuth}
