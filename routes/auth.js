const express=require('express')
const router =express.Router()
const mongoose=require("mongoose")
const cors=require("cors")
const User=mongoose.model("User")
const bcrypt=require("bcryptjs")
const jwt=require('jsonwebtoken')
const JWT_SECRET = "ewdfgfvcvsgxcjysl"; // Your secret key
const requireLogin=require("../middleware/requireLogin")



router.use(cors({                           //cors ka use  client aur sever ke bich connection banane ke liye kiya jata hai kyuki client aur sever alg alg domain pe run hote hai
    origin:["http://localhost:5173"],    //   "proxy": "http://localhost:4000", is line ko react me package.json me type ke bad add krdo tb hume node me cors install krne ki jarurt nhi pdegi
    credentials:true
}))


router.get('/protected',requireLogin,(req,res)=>{
    res.send("hello user")
})
//signup page
router.post('/signup',(req,res)=>{
  const {name,email,password}=req.body
  if(!email || !password || !name){
  return  res.status(422).json({error :"please add all the field"})
  }
 
  User.findOne({email:email})
  .then((savedUser)=>{
    if(savedUser){
        return  res.status(422).json({error :"user allready exits with that email"})
    }

     
    bcrypt.hash(password,12)
    .then(hashedpassword=>{
        const user=new User({
            email,
            password:hashedpassword,
            name
        })
    
        user.save()
        .then(user=>{
    res.json({message:"saved successfully"})
        
        })
        .catch(err=>{
            console.log(err)
      })
    })
    .catch(err=>{
        console.log(err)})
    })
    
})


//new for signin page
router.post('/signin',(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
       return res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
       return     res.status(422).json({error:"invalid email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
             //return   res.json({message:"Successfully signed in"})
             const token=jwt.sign({_id:savedUser._id},JWT_SECRET)
             const {_id , name , email}=savedUser
             res.json({token ,user:{ _id ,name,email}})
            }else{
             return   res.status(422).json({message:"invalid email or password"})

            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

module.exports=router