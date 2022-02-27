const jwt = require('jsonwebtoken');
const util = require('../utils/util');
let path = require('path');
const multer = require('multer');
const fs = require("fs");
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.CLIENT_ID)
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const CryptoJS = require("crypto-js");
var key = "ASECRET";

let mongoose = require('mongoose'),
  express = require('express'),
  router = express.Router();

// user Model
let userSchema = require('../models/user');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'profile-pics');
    },
    filename: function(req, file, cb) {   
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

let upload = multer({ storage, fileFilter });

// CREATE user
router.route('/create-user').post(upload.single('photo'), (req, res) => {
    const name = req.body.name;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const bio = req.body.bio;
    const photo = req.file.filename;

    userSchema.findOne({email:email},(err,user)=>{
        if(user){
            return res.json('emailExist');
        }else{
            userSchema.findOne({username:username},(err,data)=>{
                if(data){
                    return res.json('userExist');
                }else{
                    
                    const newUserData = {
                        name,
                        username,
                        email,
                        password,
                        photo,
                        bio
                    }
                
                
                    const newUser = new userSchema(newUserData);
                
                    newUser.save()
                           .then(() =>  {return res.json('Added')})
                           .catch(err => res.status(400).json('Error: ' + err));
                }

            })
        }

    })

});
// Facebook login
router.route('/api/v1/auth/facebook').post( async function (req, res) {
    const name  = req.body.name;
    const email  = req.body.email;
    const picture  = req.body.picture.data.url;
    try{
        const existingUser = await userSchema.findOne({ email: email });
          
          if(!existingUser){
            const newUserData = {
                name,
                username:email,
                email,
                password:"",
                photo:picture,
                bio:""
            }

            const newUser = new userSchema(newUserData);

            await newUser.save()
                .then(() =>  {return res.json(username + ' Added')})
                .catch(err => res.status(400).json('Error: ' + err));

            
            
            }else{
                const user = userSchema .findOne({email: email},(error, data) => {
                if (data){
                    const token = util.generateToken(data);
                    const userObj = util.getCleanUser(data); 
    
                    return res.json({ user: userObj, token });
                }})
            }

            

    }catch(err){

    }    

    
});

//Google login
router.route('/api/v1/auth/google').post( async function (req, res) {
    const { token }  = req.body
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    const { name, email, picture } = ticket.getPayload();
    
    try{
        const existingGoogleUser = await userSchema.findOne({ email: email });
          console.log(existingGoogleUser)
          if(!existingGoogleUser){
            const newUserData = {
                name,
                username:email,
                email,
                password:"",
                photo:picture,
                bio:""
            }

            const newUser = new userSchema(newUserData);

            await newUser.save()
                .then(() =>  {return res.json(username + ' Added')})
                .catch(err => res.status(400).json('Error: ' + err));

            
            
            }else{
                const user = userSchema .findOne({email: email},(error, data) => {
                if (data){
                    const token = util.generateToken(data);
                    const userObj = util.getCleanUser(data); 
    
                    return res.json({ user: userObj, token });
                }})
            }

            

    }catch(err){

    }    

    
});
//Form Login
router.route('/login-user').post(upload.single(''),(req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  if (password !== ""){

    const user = userSchema .findOne({email: email},(error, data) => {
        
        if (data){
          if ((CryptoJS.AES.decrypt((data.password),key)).toString(CryptoJS.enc.Utf8) === password){
            const token = util.generateToken(data);
            const userObj = util.getCleanUser(data);
            return res.json({ user: userObj, token });
          }else{
            return res.json({ user: 'pw' });
          }
          
        }else if(error){
          return res.json({ user: 'Error' });
        }else{
          return res.json({ user: 'User' });
        }
      })
  }else{
    return res.json({ user: 'Authentication Apps only' });
  }
  
});
//Session token verfication
router.route('/verifyToken').get((req, res) => {
    var token = req.body.token || req.query.token;
    if (!token) {
      return res.status(400).json({
        error: true,
        message: "Token is required."
      });
    }
    // check token that was passed by decoding token using secret
    jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
      if (err) return res.status(401).json({
        error: true,
        message: "Invalid token."
      });

      // get basic user details
      var userObj = util.getCleanUser(user);
      return res.json({ user: userObj, token });
    });
});


    

module.exports = router;