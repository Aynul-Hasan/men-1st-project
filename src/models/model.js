const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt= require('jsonwebtoken')

const userinfo= new mongoose.Schema({
    firstname:{
        type: String,
        required:true
    },
    lastname:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    phone:{
        type: Number,
        required:true,
        unique:true,
        min:11
    },
    password:{
        type: String,
        required:true
    },
   
    city:{
        type: String,
        required:true
    },
    avatar:{
        type:String

    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

})

userinfo.methods.makeToken= async function(){
    try{
        const token = jwt.sign({_id:this._id}, process.env.KEY)
        this.tokens= this.tokens.concat({token:token})
         await this.save()
         return token; 
    }catch(err){
        console.log(err)
    }
}


userinfo.pre("save", async function(next){
    if(this.isModified('password')){
         this.password= await bcrypt.hash(this.password ,10)
         console.log(this.password)

    }
    next()

})


const Userinfo = new mongoose.model('userdata', userinfo);

module.exports= Userinfo;

