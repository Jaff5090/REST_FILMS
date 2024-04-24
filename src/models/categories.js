const mongoose = require('mongoose');
const { Schema } = mongoose;
const Film = require ('./film')

const categoriesSchema = new Schema ({
    name: { type: String, required: true, maxlength: 128 },
    description: { type: String, required: true, maxlength: 2048 },
    films: [{ type: Schema.Types.ObjectId, ref: 'Film' }]
  });
  
  const categoriesModel = mongoose.model ('Categories', categoriesSchema );
  module.exports = categoriesModel;

    function getAllCategories() {
      return Categories.find();
    }
    function getCategoryById(inCategoryId) {
        return Categories.findById(inCategoryId);
      }
    function addCategory(inName, inDescription) {
        const category = new Categories({ inName, inDescription });
        return category.save();
    }
    async function addFilmToCategory(inFilmId, inCategoryId){
        const filmdb = await Film.getFilmById(inFilmId);
        const categorydb = await getCategoryById(inCategoryId);
        categorydb.films.push(filmdb);
        await categorydb.save();
    }

    //getAllFilmsByCategory()
    module.exports = {
      getAllCategories,
      getCategoryById,
      addCategory,
      addFilmToCategory
  };