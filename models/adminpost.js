const express=require('express')
const mongoose =require("mongoose")
const adminSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        default:"no photo"
    }
})

mongoose.model("Postadmin",adminSchema)