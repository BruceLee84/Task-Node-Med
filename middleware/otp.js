const {totp}=require("otplib");
require('dotenv').config();

function otp(){
    const secreatkey='otpkey'
    const token = totp.generate(secreatkey)
    // console.log("secreatKey",secreatkey)
    // console.log("otp", token)
}
otp()

function verify(){
    const secreatkey ='otpkey'
    const token = totp.generate(secreatkey)
    // console.log("secreatKey",secreatkey)
    // console.log("verify otp", token)
    const same =totp.check(token, secreatkey)

}

verify()
module.exports={otp}