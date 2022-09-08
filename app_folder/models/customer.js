'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema ({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: [{
        type: String,
        required: true,
        enum: ['user', 'admin'], 
        default: 'user'
    }] /*  roles = array ou vetor*/

});

module.exports = mongoose.model('customer', schema); /* nome do schema = Product  */