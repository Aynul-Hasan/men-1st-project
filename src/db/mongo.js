const mongoose=require('mongoose')



mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
//   useFindAndModify: false,
  useCreateIndex: true
}).then(()=>{
    console.log(`database running...`)
}).catch(()=>{
    console.log(`database not running`)
})