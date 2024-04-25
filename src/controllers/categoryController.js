const Categories = require('../models/categories');

async function getAllCategories() {
    return await Categories.find().populate('films');
}

async function getCategoryById(inCategoryId) {
    return await Categories.findById(inCategoryId);
}

async function addCategory(inName, inDescription, filmsIds) {
    const category = new Categories({ name: inName, description: inDescription, films: filmsIds });
    return await category.save();
}
async function deleteCategory(inCategoryId) {
    return await Categories.findByIdAndDelete(inCategoryId);
}

async function updateCategory(categoryId, updateData) {
    const category = await Categories.findById(categoryId);
    if (!category) {
        throw new     Error('Category not found');
    }

    category.name = updateData.name || category.name;
    category.description = updateData.description || category.description;
    if (updateData.films) {
        category.films = updateData.films; 
    }

    await category.save();
    return category;
}

async function addFilmToCategory(inFilmId, inCategoryId) {
    const category = await Categories.findById(inCategoryId);
    if (!category) throw new Error('Category not found');
    if (!category.films.includes(inFilmId)) {
        category.films.push(inFilmId);
        return await category.save();
    } else {
        throw new Error('Film already added to category');
    }
}


module.exports = {
    getAllCategories,
    getCategoryById,
    addCategory,
    addFilmToCategory,
    deleteCategory,
    updateCategory
};
