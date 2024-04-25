const Film = require('../models/film');

async function getAllFilms({ search, page = 1, limit = 10 }) {
    const query = {};
    if (search) {
        query.$or = [
            { title: { $regex: new RegExp(search, 'i') } },
            { description: { $regex: new RegExp(search, 'i') } }
        ];
    }

    try {
        const films = await Film.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('categories');
        const total = await Film.countDocuments(query);
        return  {
            _links: {
                self: { href: `/api/films?page=${page}&limit=${limit}` },
                next: { href: `/api/films?page=${page + 1}&limit=${limit}` },
                prev: page > 1 ? { href: `/api/films?page=${page - 1}&limit=${limit}` } : undefined
            },
            total,
            page,
            totalPages: Math.ceil(total / limit),
            films: films.map(film => ({
                ...film._doc,
                _links: {
                    self: { href: `/api/films/${film._id}` },
                    categories: film.categories.map(cat => ({
                        href: `/api/categories/${cat._id}`
                    }))
                }
            }))
        };
    } catch (error) {
        throw new Error('Error retrieving films: ' + error.message);
    }
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
