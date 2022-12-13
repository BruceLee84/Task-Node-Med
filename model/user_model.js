const mongoose = require('mongoose');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
    uuid:{type:String, require:true},
    userName:{type:String, require:true},
    Email:{type:String, require:true},
    PhoneNumber:{type:String, require:true},
    Password:{type:String, require:true},
    role:{type: String, enum:['admin', 'user'], required: false, default: 'user'},
    accountType:{type:String, enum:['SignUp', 'Google', 'facebook'], require:false, default:'SignUp'},
    active:{type:Boolean, require:false, default:false},
    otp:{type:String,required:false},
    loginStatus:{type:Boolean, require:false, default:false},
    lastvisted:{type:String, require:false}
},{
    timestamps:true
});

userSchema.pre('save', function(next){
    this.uuid="user"+crypto.pseudoRandomBytes(6).toString('hex').toUpperCase()
    next()
});

module.exports = mongoose.model('user', userSchema);