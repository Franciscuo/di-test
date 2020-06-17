const { Schema, model } = require('mongoose');

const itemSchema = new Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    stock: { type: Number, default: 0 },
    price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = model('Items', itemSchema);