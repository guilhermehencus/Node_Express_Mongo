'use strict';

const mongoose = require('mongoose');
const Customer = mongoose.model('customer');

exports.create = async(data) => {
    var customer  = new Customer(data);
     await customer.save();
} 
exports.authenticate = async(data) => {
     const res = await Customer.findOne({
        email: data.email,
        password: data.password
     }, );
     return res;
}
exports.getById = async(id) => {
    const res = await Customer.findById(id);
    return res;
}