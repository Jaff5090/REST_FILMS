const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Film = require('../models/film');

// Define validation rules for film data
const filmValidationRules = () => [
    body('name').isLength({ max: 128 }).withMessage('Name must be less than 128 characters'),
    body('description').isLength({ max: 2048 }).withMessage('Description must be less than 2048 characters'),
    body('releaseDate').isISO8601().withMessage('Release date must be in ISO 8601 format'),
    body('rating').optional().isInt({ min: 0, max: 5 }).withMessage('Rating must be an integer between 0 and 5')
];


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
 *                 $ref: '#/components/schemas/Film/films'
 */
  router.get('/', async (req, res) => {
    try {
        const films = await Film.getAllFilms();
        res.status(200).json(films);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving films : ", error: error.message });
    }
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
 *           type: string
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
router.get('/:id', async (req, res) => {
    try {
        const film = await Film.getFilmById(req.params.id);
        if (film) {
            res.status(200).json(film);
        } else {
            res.status(404).send('Film not found');
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving film", error: error.message });
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

  router.post('/', filmValidationRules(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        const { name, description, releaseDate, rating } = req.body;
        const film = await Film.addFilm(name, description, releaseDate, rating);
        res.status(201).json(film);
    } catch (error) {
        res.status(500).json({ message: "Error adding film", error: error.message });
    }
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
 *           type: string
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

router.put('/:id', filmValidationRules(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        const { name, description, releaseDate, rating } = req.body;
        const updatedFilm = await Film.updateFilm(req.params.id, name, description, releaseDate, rating);
        if (updatedFilm) {
            res.status(200).json(updatedFilm);
        } else {
            res.status(404).send('Film not found');
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating film", error: error.message });
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
 *           type: string
 *     responses:
 *       200:
 *         description: Film deleted successfully
 *       404:
 *         description: Film not found
 */

router.delete('/:id', async (req, res) => {
    try {
        const film = await Film.deleteFilm(req.params.id);
        if (film) {
            res.status(200).json(film);
        } else {
            res.status(404).send('Film not found');
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting film", error: error.message });
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