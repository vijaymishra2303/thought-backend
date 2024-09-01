require('./mongoose')
const express =require('express')
const app = express()
const mongoose = require('mongoose')


mongoose.connection.on('connected',()=>{
    console.log("connected to mongodb")
})
mongoose.connection.on('error',(err)=>{
    console.log("error connecting", err)
})

require('./models/user')
require('./models/post')
require("./models/adminpost")
// const router = require('./routes/auth')
// const router=require("./routes/post")


app.use(express.json())
app.use(require('./routes/auth'))
app.use(require("./routes/post"))





// const customMiddleware=(req,res,next)=>{
//     console.log("Middleware execute !!")
//     next()
// }

// app.get('/',(req,res)=>{
//     console.log("home")
//     res.send("hello word")
// })

// app.get('/about',customMiddleware,(req,res)=>{
//     console.log("about")
//     res.send("about page")
// })




app.listen(5000,()=>{
    
    console.log("Server is running on",5000)
})