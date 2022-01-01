const express = require('express');
const mongoose = require('mongoose');
const Crypt = require('cryptr');
const cookieParse = require('cookie-parser');
const app = express();
const port = 8000;
const User = require('./Userdb');
const Record =require('./Record');
const db = require('./mongoose');
const { session } = require('passport');
const MongoStore = require('connect-mongo')(req.cookie.info);
app.use(express.urlencoded());
app.use(cookieParse());
app.use('/assets', express.static('./assets'))
app.use('/E-doctor/uploads', express.static('./uploads'));
const crypt = new Crypt('VYjHy6XJSQ');
app.set('view engine', 'ejs');
app.set('views', './views')
app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
app.get('/', function (req, res) {
    return res.render('login');



})
app.get('/sign-up', function (req, res) {
    return res.render('sign-up');
})
app.post('/create', function (req, res) {
    console.log(req.body);
    User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phoneno: req.body.phoneno,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,

    }, function (err, user) {
        if (err) {
            console.log(err);
            return;
        }
        return res.redirect('/')
    })
});
app.post('/create-session', function (req, res) {
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            console.log(err);
            return;
        }
        if (user) {
            if (user.password != req.body.password) {
                return res.redirect('back');
            }
            const key = crypt.encrypt(user._id);
            res.cookie('info', key);

            return res.redirect('/index')
        }
        return res.redirect('back');
    })
})
app.get('/index', function (req, res) {
    if (req.cookies.info) {
        const ans = crypt.decrypt(req.cookies.info);
        console.log(ans);
        User.findById(ans, function (err, user) {
            if (err) {
                return;
            }
            if (user) {
                return res.render('index', {
                    firstname: user.firstname,
                    lastname: user.lastname
                })
            } else {
                return res.redirect('/');
            }

        });

    } else {
        return res.redirect('/');
    }
})
app.get('/login/blog', function (req, res) {
    if (req.cookies.info) {

        return res.render('blog');


    }
    return res.redirect('/');
})
app.post('/upload',function(req,res){
    if(req.cookies.info){
        const ans = crypt.decrypt(req.cookies.info);
        console.log(ans);
        
     Record.uploadedRecord(req,res,function(err){
        if(err){
            console.log(err);
        }
        let path2 =   Record.recordPath.replace("\\", "/");
        let record ;
         Record.create({
            record:path2+'/'+req.file.filename ,
            user:ans
         },function(err,record){
            if(err){
                console.log(err);
                return ;
            }
           
           
         })
     })
    return res.redirect('back');
    }
    return res.redirect('/');
})
app.get('/login/upload',function(req,res){
    
        const ans = crypt.decrypt(req.cookies.info);
  
Record.find({user:ans} ,function(err,post){
    if(err){
      console.log(err);
    }
    if(post.length>0){
    return res.render('upload' ,{
        link:post
    });
    }else{
      return res.render('upload' ,{
        link:""
    });
    }
      });
    
 })

app.get('/logout', function (req, res) {
    res.clearCookie('info');
    return res.redirect('/');
})
