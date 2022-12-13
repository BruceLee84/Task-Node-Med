const mongoose = require('mongoose');
const crypto = require('crypto');

const product = new mongoose.Schema({
    uuid:{type:String, require:true},
    id:{type:Number, require:true},
    Name:{type:String, require:true},
    expiryDate:{type:String, require:true},
    price:{type:Number, require:true},
    image:{type:String, require:true},
    quantity:{type:Number, require:true},
    Manufacturer:{type:String, require:true},
    categoryuuid:{type:String, require:true},
    categoryName:{type:String, require:true},
    AdminUuid:{type:String, require:true},
},{
    timestamps:true
})

product.pre('save', function(next){
    this.uuid = 'Pro'+crypto.pseudoRandomBytes(6).toString('hex').toUpperCase()
    next()
});

module.exports = mongoose.model('Medicine', product);