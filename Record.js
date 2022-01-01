const multer =require('multer');
const path = require('path');
const Record_path= path.join('E-doctor/uploads');
const mongoose = require('mongoose');
const recordSchema = new mongoose.Schema({
    record:{
        type:String
    },
    user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
    }
});
let storage = multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,path.join(__dirname ,'..',Record_path));
    },
    filename:function(req,file,cb){
        console.log(file.filename+"888")
        cb(null,file.fieldname+'_'+Date.now());
    }
    
})
recordSchema.statics.uploadedRecord=multer({storage:storage}).single('record');
recordSchema.statics.recordPath = Record_path;
const record = mongoose.model('Record',recordSchema);
module.exports=record;