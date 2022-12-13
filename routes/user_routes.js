const router = require('express').Router();
const bcrypt = require('bcrypt');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const{totp} = require('otplib');
const otp = require('../middleware/otp');
const fast2sms = require('fast-two-sms');
const userSchema = require('../model/user_model');
const {mailSender, mailSend} = require('../middleware/email');
const res = require("express/lib/response");
require('dotenv').config();
const twillo = require('twilio')(process.env.account_Sid, process.env.auth_Token)

router.post('/register', async(req, res)=>{
   try {
    let userName = req.body.userName;
    let Email = req.body.Email;
    let PhoneNumber = req.body.PhoneNumber;
    
    if(userName){
        let nameData = await userSchema.findOne({"userName":userName}).exec();
    console.log('name', nameData)
        if(nameData){
            return res.status(400).json({'status':'failed', 'message':'user name already exist'})
        } 
    }else{
        return res.status(404).json({'status':'failed', 'message':'use another name'})
    }

    if(Email){
        let emailData = await userSchema.findOne({"Email":Email}).exec();
        if(emailData){
            return res.status(400).json({"status":"failed", "message":"email id already exist"})
        }
    }else{
        return res.status(400).json({"status":"failed", "message":"use another Email id"})
    }

    if(PhoneNumber){
        let numberData = await userSchema.findOne({"PhoneNumber":PhoneNumber}).exec();
        if(numberData){
            return res.status(400).json({"status":"failed", "message":"mobile number already exist"})
        }
    }else{
        return res.status(400).json({"status":"failed", "message":"use another Number"})
    }

    let userDetail = new userSchema(req.body);
     if(req.body.Password){
     let Password = req.body.Password;
     const salt = await bcrypt.genSalt(10);
     userDetail.Password = bcrypt.hashSync(Password, salt)
   }

    const result = await userDetail.save();
    console.log('res', result)

    if(result){
        const toEmail = result.Email;
        const subject = 'mail'
        var mail = {
            from:'thorodinson00t@gmail.com',
            //from :'balamurugan.platosys@gmail.com',
            to: toEmail,
            subject: subject,
            // text : "hello",
            fileName:"email.ejs",
            detail:{userName:userDetail.userName}
        }
        // console.log("mail", mail)
        let detail = mailSender.mailSender(mail)
        console.log("det", detail)
        return res.status(200).json({"status":'success', "message":'register successed', 'result':result});
      }
    } catch (error) { 
       return res.status(404).json({"status":"error found", "message":error.message})
   }
})


router.get('/mail/:userName', async (req, res)=>{
    try {
        detail = await userSchema.findOneAndUpdate({userName:req.params.userName},{active:true},{new:true}).exec()
        if(detail){
            console.log("activated")
        }
        res.send("<h4>Activated</h4>")
    } catch (error) {
        return res.status(404).json({"status":"failed", "message":error.message})
    }
})


router.put('/edit', async(req, res)=>{
    try {
        const userData = await userSchema.findOneAndUpdate({Email:req.body.Email}, {PhoneNumber:req.body.PhoneNumber}, {new:true}).exec();
        // then(data=>{
        //    var sms = {
        //        authorization:'0WWgUWR5O4S3aXszuKKbPGAPId60xsNcRI1yn4Od0BeZCZM2qFrr3s6NtMLI',
        //        message : 'verify Phone Number ',
        //        numbers : [result.PhoneNumber]
        //    }
        //        fast2sms.sendMessage(sms).then(response=>{
        //         console.log("Result", response)
        //        }).catch(err=>{
        //         console.log("err", err)
        //        })
        //    })
    
        return res.status(200).json({"status":'success', "message":'Data Updated', 'result':userData});
    } catch (error) {
        return res.status(404).json({"status":"failed", "message":error.message}) 
    }
})

router.post('/login', async (req, res)=>{
    try {
        let userName = req.body.userName;
        let Password = req.body.Password;
    //    let data = await userSchema.findOneAndUpdate({Name:Name},{loginStatus:true},{new:true}).exec();
        const userData = await userSchema.findOne({userName:userName}).exec();
       console.log("userData", userData)
     let nameData;
        if(userName){
             nameData = await userSchema.findOne({userName:userName}).exec();
            if(!nameData){
                return res.status(400).json({"status":"failed", "message":"please sigup first"})
            }
        }else{
            return res.status(404).json({"status":"failed", "message":"Enter your correct Name"})
        }
        if(userData){
            let isMatch = await bcrypt.compare(Password, userData.Password)
            if(userData!== true){
                await userSchema.findOneAndUpdate({uuid:userData.uuid},{loginStatus:true},{new:true})
            }

            if(isMatch){
                let userDetail = userData.toObject();
                console.log('user_data', userDetail);
                let token = jwt.sign({uuid:userDetail.uuid}, 'bala123', {expiresIn: '24h'})
                userDetail.token = token

                // data = otp.otp('send')
                // await userSchema.findOneAndUpdate({uuid:userData.uuid}, {otp:data}, {new:true})
                // var sms ={
                //     authorization:'',
                //     message: "your otp "+data,
                //     numbers:["9087009016"]
                // };

                // console.log("otp",sms)
                // fast2sms.sendMessage(sms).then((response)=>{
                //     console.log(response)
                // }).catch((err)=>{
                //     console.log(err.meaasage)
                // })
                return res.status(200).json({"status":"success", "message":"Login successfully", "result":userDetail}) 
            }
        }else{
            return res.status(400).json({"status":"failed", "message":"Login failed"})
        }
    } catch (error) {
        return res.status(404).json({"status":"error found", "message":error.message}) 
    }
})


router.post("/logout", async(req,res)=>{
    try {
        let Date = moment().toDate();
        console.log(Date)
       const data = await userSchema.findOneAndUpdate({uuid: req.query.uuid},{loginStatus:false},{new:true})
        return res.status(200).json({status: "success", message: "sign-out", "result":data})
    } catch (error) {
        console.log(error.message)
        return res.status(404).json({status: "failure", message: error.message})
    }
})


totp.options = { digits : 4 }

router.post('/forgotPass',async(req,res)=>{
    try{
       const Email = req.query.Email;
       const key = '84126';
       const msg = totp.generate(key);
       console.log(msg);
       await userSchema.findOneAndUpdate({Email:Email},{totp:msg},{new:true}).then(result=>{
           twillo.messages.create({
            from : '+19894991599',
            to : "+919087009016",
            body : 'otp:' + msg
           }).then(forgot=>{
            console.log('otp sent successfully')
           }).catch(err=>{
            console.log('err', err.message)
           })
            
            //    let toMail = result.Email
            //         let subject = "forgot password"
            //         let text = `otp : ${msg}`
            //         let Data = {
            //            from : 'thorodinson00t@gmail.com',
            //            to : toMail,
            //            subject : subject ,
            //            text : text
            //         }
            //     mailSend(Data)
            //     console.log('email', Email)

            res.status(200).json({"status":"success", "message":"otp sended"})        
                    
       }).catch(error=>{
           console.log('error found')
           res.status(400).json({"status":"failed", "message":error.message})
       })
    }catch(error){
       console.log(error.message)
       res.status(404).json({"status":"failed", "error":error.message})
    }
   })


   
router.post('/resetPass',async(req,res)=>{
       try{
           bcrypt.hash(req.query.newPassword,3,function(error,hashcode){
               if(error){
                   console.log(error.message)
               }
               const otp = req.query.otp
               const newPassword = hashcode
               console.log("password",newPassword)
            userSchema.findOneAndUpdate({otp:otp},{password:newPassword},{new:true}).then(result=>{
              res.status(200).json({"status":"success", "message":"password reset"})
              console.log("reset successful"); 
            }).catch(error=>{
               res.status(400).json({"status":"failed", "message":error.message})
            })
           })
       }catch(error){
           res.status(404).json({"status":"error found" , "error":err.message})
       }
   })



   router.post('/otp',async(req,res)=>{
    try {
        const PhoneNumber = req.body.PhoneNumber
        const text = req.body.text
        twillo.messages.create({
            from : '+19894991599',
            to : "+91" + PhoneNumber ,
            body : text
        }).then(response=>{
            console.log('otp send')
            res.status(200).json({status:'success', message:'sms sended'})
 
        }).catch(err=>{
            console.log('err',err.message)
            res.status(404).json({"status":"failed", "err":err.message})
        })
    } catch (error) {
        res.status(404).json({"status":"failed", "error":error.message})
    }

     // var smsOtp ={
        //     authorization:'',
        //     message : 'otp ',
        //     numbers : PhoneNumber
        //     }
})


router.get('/getUser', async(req, res)=>{
    try {
        const data = await userSchema.find().exec()
        // console.log('users', data)
        if(data){
            return res.status(200).json({'status':'success', 'message':'data found', 'result':data})
        }else{
            return res.status(400).json({'status':'failed', 'message':'data not found'})
        }
    } catch (error) {
       return res.status(404).json({"status":"failed", "error":error.message})
    }
})

router.get('/getoneUser', async(req, res)=>{
    try {
        const data = await userSchema.find({uuid:req.query.uuid}).exec()
        if(data){
            return res.status(200).json({'status':'success', 'message':'data found', 'result':data})
        }else{
            return res.status(400).json({'status':'failed', 'message':'data not found'})
        }
    } catch (error) {
        return res.status(404).json({"status":"failed", "error":error.message})
    }
})

router.put('/edit', async(req, res)=>{
    try {
        const update = req.body.update
        const data = await userSchema.findOneAndUpdate({uuid:req.body.update.uuid},update,{new:true}).exec();
        return res.status(200).json({'status':'Success', 'message':'data updated', 'result':data})
    } catch (error) {
        return res.status(404).json({'status':'error found', 'message':error.message}) 
    }
})


router.put('/editUser',async(req,res)=>{
    try{
        const uuid = req.body.uuid;
        await userSchema.findOneAndUpdate({uuid:uuid}, req.body, {new:true}).then(result=>{
            // console.log('edit', result)
            return res.status(200).json({'status':'Success', 'message':'data updated', 'result':result})
        }).catch(err=>{
            console.log(err.message)
            res.json({'err':err.message})
        })
    }catch (error) {
        return res.status(404).json({'status':'error found', 'message':error.message})
    }  
})


router.delete('/deleteUser', async(req, res)=>{ 
    try {
        const uuid = req.query.uuid;
        await userSchema.findOneAndDelete({uuid:uuid}).then(result=>{
            return res.status(200).json({'status':'success', 'message':'data deleted', result})
        }).catch(err=>{
            console.log(err.message)
            res.json({'err':err.message})
        })    
    } catch (error) {
        return res.status(404).json({'status':'error found', 'message':error.message})
    }
})

    
 module.exports = router;