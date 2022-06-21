const { Schema, model } = require('mongoose')


const TransferSchema = new Schema({
    accountEmail: {
        type: String,  
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    }
})


const Transfer = model('transfer', TransferSchema)

module.exports = Transfer