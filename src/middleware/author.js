const jwt =require('jsonwebtoken');
const { model } = require('mongoose');
const userinfo=require('../models/model')



const author =async (req,res, next)=>{
    try{
        const token = req.cookies.jwt;
        // console.log(token)
        const verifyUser= jwt.verify(token,process.env.KEY)
        const user = await userinfo.findOne({_id:verifyUser._id})


        req.token=token;
        req.user=user
        // console.log(req.user)

        next()
    }catch(err){
       res.render('login')
    }
}


module.exports= author ;
