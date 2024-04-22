class Film {
    constructor(id, name, description, releaseDate, rating) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.releaseDate = releaseDate;
        this.rating = rating;
    }
}
// using a local List of films 
const films = [
    new Film(1, "Inception", "Un thriller sur les rêves.", "2010-07-16", 5),
    new Film(2, "Interstellar", "Un voyage au-delà des étoiles.", "2014-11-07", 5),
    new Film(3, "The Dark Knight", "Batman affronte le Joker à Gotham.", "2008-07-18", 5)
];

function getAllFilms() {
    return films;
}

function getFilmById(id) {
    return films.find(film => film.id === id);
}

function addFilm(name, description, releaseDate, rating) {
    const newFilm = new Film(films.length + 1, name, description, releaseDate, rating);
    films.push(newFilm);
    return newFilm;
}

function updateFilm(id, name, description, releaseDate, rating) {
    const film = getFilmById(id);
    if (film) {
        film.name = name;
        film.description = description;
        film.releaseDate = releaseDate;
        film.rating = rating;
        return film;
    }
    return null;
}

function deleteFilm(id) {
    const index = films.findIndex(film => film.id === id);
    if (index !== -1) {
        return films.splice(index, 1)[0];
    }
    return null;
}

module.exports = {
    getAllFilms,
    getFilmById,
    addFilm,
    updateFilm,
    deleteFilm
};
