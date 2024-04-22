const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { getAllFilms, getFilmById, addFilm, updateFilm, deleteFilm } = require('../models/film');


// validate necessary Rules
const filmValidationRules = () => {
    return [
      body('name').isLength({ max: 128 }).withMessage('Name must be less than 128 characters'),
      body('description').isLength({ max: 2048 }).withMessage('Description must be less than 2048 characters'),
      body('releaseDate').isISO8601().withMessage('Release date must be in ISO 8601 format'),
      body('rating').optional().isInt({ min: 0, max: 5 }).withMessage('Rating must be an integer between 0 and 5')
    ];
  }


  /**
 * @openapi
 * /api/films:
 *   get:
 *     summary: Get a list of all films
 *     responses:
 *       200:
 *         description: A list of films.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Film'
 */
router.get('/', (req, res) => {
    res.status(200).json(getAllFilms());
});

/**
 * @openapi
 * /api/films/{id}:
 *   get:
 *     summary: Get a single film by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single film object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Film'
 *       404:
 *         description: Film not found
 */
router.get('/:id', (req, res) => {
    const film = getFilmById(parseInt(req.params.id));
    if (film) {
        res.status(200).json(film);
    } else {
        res.status(404).send('Film not found');
    }
});


  /**
 * @openapi
 * /api/films:
 *   post:
 *     summary: Add a new film
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FilmInput'
 *     responses:
 *       201:
 *         description: Film created successfully
 *       422:
 *         description: Validation error
 */

router.post('/', filmValidationRules(), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { name, description, releaseDate, rating } = req.body;
    const film = addFilm(name, description, releaseDate, rating);
    res.status(201).send(film);
});

/**
 * @openapi
 * /api/films/{id}:
 *   put:
 *     summary: Update a film
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FilmInput'
 *     responses:
 *       200:
 *         description: Film updated successfully
 *       404:
 *         description: Film not found
 */

router.put('/:id', filmValidationRules(), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { name, description, releaseDate, rating } = req.body;
    const updatedFilm = updateFilm(parseInt(req.params.id), name, description, releaseDate, rating);
    if (updatedFilm) {
        res.status(200).json(updatedFilm);
    } else {
        res.status(404).send('Film not found');
    }
});

/**
 * @openapi
 * /api/films/{id}:
 *   delete:
 *     summary: Delete a film
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Film deleted successfully
 *       404:
 *         description: Film not found
 */

router.delete('/:id', (req, res) => {
    const film = deleteFilm(parseInt(req.params.id));
    if (film) {
        res.status(200).json(film);
    } else {
        res.status(404).send('Film not found');
    }
});

/**
 * @openapi
 * components:
 *   schemas:
 *     Film:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         releaseDate:
 *           type: string
 *         rating:
 *           type: integer
 *     FilmInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         releaseDate:
 *           type: string
 *         rating:
 *           type: integer
 */

module.exports = router;