const express=require("express")
const router=express.Router();
const bcrypt=require('bcrypt');
const mongoose=require("mongoose");
const USER=mongoose.model("USER")
const jwt=require("jsonwebtoken")
const {jwt_secret}=require("../keys");
const requireLogin = require("../middlewres/requireLogin");


router.post("/signup",(req,res)=>{
   const {name,userName,email,password}=req.body;
   if(!name || !email || !userName || !password){
    return res.status(422).json({error:"Please fill all the details"})
   }
   USER.findOne({$or:[{email:email},{userName:userName}]}).then((savedUser)=>{
    if(savedUser){
        return res.status(422).json({error:"Email or username already exists"})
       }
       bcrypt.hash(password,12).then((hashedPassword)=>{
        const user = new USER({
            name,
            email,
            userName,
            password:hashedPassword
           })
           user.save()
           .then(user=>{res.json({message:"SignUp Succesfully"})})
           .catch(err=>{console.log(err)})
       })
       

   })
  
})
router.post("/signin",(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(422).json({error:"Please fill all the details"})
    }
    USER.findOne({email:email}).then((savedUser)=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email or password"})
        }
        bcrypt.compare(password,savedUser.password).then((match)=>{
            if(match){
                // return res.status(200).json({message:"Signed in successfully"})
                const token=jwt.sign({_id:savedUser.id},jwt_secret)
                const {_id,name,email,userName}=savedUser
                res.json({token,user:{_id,name,email,userName}})
                console.log({token,user:{_id,name,email,userName}})
            }
            else{
                return res.status(402).json({error:"inavlid password"})
            }
        })
        .catch(err=>console.log(err))
    })
})
module.exports=router;