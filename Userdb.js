const mongoose = require('mongoose');
const User_Schema = new mongoose.Schema({
   firstname:{
        type:String,
      required:true  
    },
    lastname:{
        type:String,
        required:true 
    },
    phoneno:{
        type:Number,
        required:true 
    },
    email:{
        type:String,
        required:true 
    },
    username:{
        type:String,
        required:true 
    },
    password:{
        type:String,
        required:true
        
    },

},{
    timestamps: true 
})
const User = mongoose.model('User',User_Schema);
module.exports=User;