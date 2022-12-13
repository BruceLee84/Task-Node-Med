const jwt = require('jsonwebtoken');
const user = require('../model/user_model');
require('dotenv').config();

function authverify (req, res, next){
    try{
       let token = req.header("token");
       console.log("Token", token);
       if(!token){
           return res.json({"status":"failed", "message":"unauthoriced"})
       } 
       const decode = jwt.verify(token, 'bala123');
       console.log("Decode", decode);
       next();

    }catch(err){
        console.log(err.message)
        return res.status(404).json({"status":"failed", "message":err.message})
    }
}


function isAdmin (req, res, next){
    try{
        
        let token = req.header("token");
        console.log('token:', token)
        
        if(!token){
            return res.json({"status":"failed",  "message":"unauthoriced"})
        }
        const decode = jwt.verify(token, 'bala123')
        console.log('data', decode)
        console.log("succees")
        const userdata = user.findOne({uuid:decode.uuid}).exec().then(data=>{
            console.log('user', data)
         if(data.role == "admin"){
            console.log("welcome back admin")
            next();
         
        }else{
            return res.json({"status":"failed", "message":"only access admin"})
        }
    })
    }catch(error){
        return res.status(404).json({"status":"failed", "message":error.message})
    }
}




module.exports ={authverify,isAdmin}