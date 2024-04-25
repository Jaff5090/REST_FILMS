const mongoose = require('mongoose');
const { Schema } = mongoose;

const filmSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 128 },
    description: { type: String, required: true, maxlength: 2048 },
    releaseDate: { type: Date, required: true },
    rating: { type: Number, min: 0, max: 5 },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Categories' }]
});

const Film = mongoose.model('Film', filmSchema);
module.exports = Film;
