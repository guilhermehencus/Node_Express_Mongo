'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema ({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer' /* Trazer informação da tabela customer */
    },
    number: {
        type: String,
        required: true,
        trim: true /* trim: remover espaços antes e depois da strings */
    },
    createDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        required: true,
        enum: ['created', 'done'], /* enum: forçar a receber dois valores */
        default: 'created'
    },
    itens: [{
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
        price: {
            type: Number,
            required: true
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product' /* Trazer informação da tabela Product */
        },
    }],

});

module.exports = mongoose.model('Order', schema); /* nome do schema = Product  */