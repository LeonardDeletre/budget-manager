const { Schema, model } = require('mongoose')


const TransferSchema = new Schema({
    AccountEmail: {
        type: String,  
        required: true,
    },
    Amount: {
        type: Number,
        required: true,
    },
    Date: {
        type: Date,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    Title: {
        type: String,
        required: true,
    },
    Type: {
        type: String,
        required: true,
    },
    Currency: {
        type: String,
        required: true,
    },
    Category: {
        type: String,
        required: true,
    }
})


const Transfer = model('transfer', TransferSchema)

module.exports = Transfer