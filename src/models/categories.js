const mongoose = require('mongoose');
const { Schema } = mongoose;
const Film = require('./film');

const categoriesSchema = new Schema({
    name: { type: String, required: true, maxlength: 128 },
    description: { type: String, required: true, maxlength: 2048 },
    films: [{ type: Schema.Types.ObjectId, ref: 'Film' }]
});

const Categories = mongoose.model('Categories', categoriesSchema);
module.exports = Categories;
