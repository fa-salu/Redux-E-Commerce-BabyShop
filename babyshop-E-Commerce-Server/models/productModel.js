const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    stars: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    type: { type: String, enum: ['boy', 'girl'], required: true }, 
    stock: { type: Number, required: true },  
});

module.exports = mongoose.model('Product', productSchema);
