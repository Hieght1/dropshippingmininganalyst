


const mongoose = require('mongoose');


const widthdrawSchema = new mongoose.Schema({
    
    amount: {
        type: Number,
    },

    wallet: {
        type: String,
    },

    type:{
        type:String
    },

    status: {
        type: String,
        default: 'pending'
    },
  
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        // required: true
    }
}, {timestamps: true});

const Widthdraw = mongoose.model('widthdraw', widthdrawSchema);

module.exports = Widthdraw;
