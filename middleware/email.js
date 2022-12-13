const nodemailer = require('nodemailer');
const sendGrid = require('@sendgrid/mail');
const ejs = require('ejs');
require('dotenv').config();
const {join} = require('path');
// const datas =require('../view/')


sendGrid.setApiKey(process.env.smsKey);
// console.log("pro", process.env.smsKey);

const transport = nodemailer.createTransport({
    service:'gmail',

    auth:{
        user: process.env.emailId,
        pass: process.env.password
    }
});

async function mailSender(mail){
    try {
        const data = await ejs.renderFile(join(__dirname, '../view/', mail.fileName),mail,mail.detail)
        // const data = await ejs.renderFile(join(__dirname,'../views/',mail.fileName),mail)
       
        const mailDetail = {
            from:mail.from,
            to:mail.to,
            subject:mail.subject,
            // attachment:mail.attachment,
            html:data
        }
        
        // console.log("data", mailDetail)
           sendGrid.send(mailDetail,(err, data)=>{
            if(err){
               console.log("err",err.message)
            // return res.status(404).json({"status":"failed", "message":err.message})
            // }
            // else{
            //     console.log("Mail send successfully")
            //     return 1
            }
            if(data){
                console.log("Mail send successfully")
                return 1
            }else{
                console.log("Mail not send ")
            }
          })

    }catch (error) {
        console.log("err", error)
        // return res.status(404).json({"status":"failed", "message":error.message})
        // process.exit(1)
    }
}



async function mailSend(mailData){
    try {
        // const mailDetail = {
        //     from:mail.from,
        //     to:mail.to,
        //     subject:mail.subject,
        //     // attachment:mail.attachment,
        //     html:data
        // }

       await sendGrid(mailData, (error, detail)=>{
        if(error){
            console.log('error', error.message)
        }if(detail){
            console.log('Mail send successfully')
        }else{
            console.log('mail not send')
        }
       })
    } catch (error) {
        console.log('error', error.message)
    }
}

module.exports={mailSender},{mailSend};