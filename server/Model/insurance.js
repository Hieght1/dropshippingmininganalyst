

const mongoose = require("mongoose");

const insuranceSchema = new mongoose.Schema({
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

const Insurance = mongoose.model("insurance", insuranceSchema)

module.exports = Insurance;
