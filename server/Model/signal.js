

const mongoose = require("mongoose");

const signalSchema = new mongoose.Schema({
    amount: {
        type: String,
    },

    method: {
        type: String,
    },

    status:{
        type:String,
        default: "pending"
    },

    image:{
        type: String,
        // required: true
    }
},{timestamps:true})

const Signal = mongoose.model("signal", signalSchema )

module.exports = Signal;
