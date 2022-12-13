const mongoose = require('mongoose');
const crypto = require('crypto');

const cart = mongoose.Schema({
    uuid : {type:String,require:false},
    useruuid : {type:String,require:true},
    products :[{productuuid:String, Name:String, image:String, Quantity:Number, price:Number}],
    total : {type:String,require:false},
    address : {type:String, require:false},
    active : {type:String,require:false,default:true},
    status : {type:String, require:false}
},{
    timestamps:true
})


cart.pre('save', function(next){
    this.uuid = "CART"+crypto.pseudoRandomBytes(6).toString('hex').toUpperCase();
    next();
    console.log('uuid',this.uuid);
})

module.exports = mongoose.model('cart',cart);