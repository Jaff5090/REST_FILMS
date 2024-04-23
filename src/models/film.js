const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 128 },
  description: { type: String, required: true, maxlength: 2048 },
  releaseDate: { type: Date, required: true },
  rating: { type: Number, min: 0, max: 5 }
});

const Film = mongoose.model('Film', filmSchema);

module.exports = Film;
function getAllFilms() {
    return Film.find();
  }
  
  function getFilmById(id) {
    return Film.findById(id);
  }
  
  function addFilm(name, description, releaseDate, rating) {
    const film = new Film({ name, description, releaseDate, rating });
    return film.save();
  }
  
  function updateFilm(id, name, description, releaseDate, rating) {
    return Film.findByIdAndUpdate(id, { name, description, releaseDate, rating }, { new: true });
  }
  
  function deleteFilm(id) {
    return Film.findByIdAndDelete(id);
  }
  

module.exports = {
    getAllFilms,
    getFilmById,
    addFilm,
    updateFilm,
    deleteFilm
};

