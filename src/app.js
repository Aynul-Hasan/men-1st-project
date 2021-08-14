require('dotenv').config();
const express= require('express')
const app=express();
const port= process.env.PORT || 8000
const hbs= require('hbs')
const path= require('path')
const bcrypt= require('bcryptjs')
// const jwt = require('jsonwebtoken');
const cookieParser= require('cookie-parser')
require('./db/mongo')
const Userinfo=require('./models/model')
const author= require('./middleware/author')

// path 
const staticPath=path.join(__dirname,"../public")
const views_path=path.join(__dirname,'../templates/views')
const partials_path=path.join(__dirname,'../templates/partials')

// middle ware
app.use(express.static(staticPath));
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.set('view engine', 'hbs');
app.set('views',views_path)
hbs.registerPartials(partials_path)


app.get('/login',(req,res)=>{
    res.render('login')
  
})
app.post('/login', async(req,res)=>{
        try{
            const email= req.body.email;
            const pass= req.body.password;
        // console.log(`${email} ${pass}`)
        const userEmail= await Userinfo.findOne({email:email})
        //  console.log(userEmail)
        const isMatch= await bcrypt.compare(pass,userEmail.password)
        const token = await userEmail.makeToken();
        res.cookie('jwt', token)
        
         if(isMatch){
             res.render('index')
         }else{
             res.send(`wrong information`)
         }

        }catch(err){
            console.log(err)
        }
    })

app.get('/signup',(req,res)=>{
    res.render('signup')
  
})

app.post('/signup', async(req,res)=>{
    try{
        const password= req.body.password;
        const cpassword=req.body.confirmpassword;
       
        if(password === cpassword){
            const data= new Userinfo({
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                phone:req.body.phone,
                password:password,
                city:req.body.city
             
            })
            const token = await data.makeToken();
            res.cookie('jwt', token)

            const saves= await data.save();
            res.status(201).render('index')

        }else{
            res.status(400).send('password has not match')
        }

    }catch(err){
        console.log(`error from signup page information ${err}`)
    }



})
app.get("/card", author,(req,res)=>{
    res.render('card')  
})

app.get('/logout',author, async (req,res)=>{
    try{
        req.user.tokens= req.user.tokens.filter((currEl)=>{
            return currEl.token!== req.token
        })
        res.clearCookie('jwt');
          await req.user.save();
        res.render('login') 
 
    }catch(err){
        res.send(err)

    }

})
app.get('/',author, (req,res)=>{
    res.render('index')
})

app.get('/logoutall',author,async(req,res)=>{
    try{
        console.log('logout success')
        req.user.tokens=[]
        res.clearCookie('jwt')
        res.render('login')
         await req.user.save()


    }catch(err){
        res.status(500).send(err)
    }

})


app.listen(port, ()=>{
    console.log(`listening success.....`)
})