const mongoose = require('mongoose');
const crypto = require('crypto');

const category = new mongoose.Schema({
    uuid:{type:String, require:true},
    categoryName:{type:String, require:true},
    image:{type:String, require:true},
    userUuid:{type:String, require:true}
},{
    timestamps:true
});

category.pre('save', function(next){
    this.uuid = "Cat"+crypto.pseudoRandomBytes(6).toString('hex').toUpperCase()
    next()
});

module.exports = mongoose.model('category', category);