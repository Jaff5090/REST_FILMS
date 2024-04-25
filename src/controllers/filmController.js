const Film = require('../models/film');

async function getAllFilms() {
    return await Film.find().populate('categories');
}

async function getFilmById(id) {
    return await Film.findById(id);
}

async function addFilm(name, description, releaseDate, rating, categoryIds) {
    const film = new Film({ name, description, releaseDate, rating, categories: categoryIds });
    return await film.save();
}

async function updateFilm(id, name, description, releaseDate, rating) {
    return await Film.findByIdAndUpdate(id, { name, description, releaseDate, rating }, { new: true });
}

async function deleteFilm(id) {
    return await Film.findByIdAndDelete(id);
}

async function addCategoryToFilm(filmId, categoryId) {
    const film = await Film.findById(filmId);
    if (!film) throw new Error('Film not found');
    if (!film.categories.includes(categoryId)) {
        film.categories.push(categoryId);
        await film.save();
    } else {
        throw new Error('Category already exists in film');
    }
    return film;
}


module.exports = {
    getAllFilms,
    getFilmById,
    addFilm,
    updateFilm,
    deleteFilm,
    addCategoryToFilm
};
