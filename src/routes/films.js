const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const filmController = require('../controllers/filmController');
const Film = require('../models/film');


const filmValidationRules = () => [
    body('name').isLength({ max: 128 }).withMessage('Name must be less than 128 characters'),
    body('description').isLength({ max: 2048 }).withMessage('Description must be less than 2048 characters'),
    body('releaseDate').isISO8601().withMessage('Release date must be in ISO 8601 format'),
    body('rating').optional().isInt({ min: 0, max: 5 }).withMessage('Rating must be an integer between 0 and 5'),
    body('categoryIds').isArray().withMessage('Categories must be an array'),  // Add validation rules for film data
    body('categoryIds.*').isMongoId().withMessage('Each category ID must be a valid MongoDB ObjectId') // Each category ID must be a valid MongoDB ObjectId
];


/**
 * @openapi
 * /api/films:
 *   get:
 *     tags:
 *       - Films
 *     summary: Get a list of all films
 *     description: Retrieves a paginated list of films, optionally filtered by title or description.
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Keyword to search in film title or description.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number of the results to retrieve.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of results per page.
 *     responses:
 *       200:
 *         description: A paginated list of films with navigation links.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _links:
 *                   type: object
 *                   properties:
 *                     self:
 *                       type: object
 *                       properties:
 *                         href:
 *                           type: string
 *                           example: '/api/films?page=1&limit=10'
 *                     next:
 *                       type: object
 *                       properties:
 *                         href:
 *                           type: string
 *                           example: '/api/films?page=2&limit=10'
 *                     prev:
 *                       type: object
 *                       properties:
 *                         href:
 *                           type: string
 *                           example: '/api/films?page=1&limit=10'
 *                 total:
 *                   type: integer
 *                   example: 50
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 films:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Film'
 */
router.get('/', async (req, res) => {
    try {
        const { search, page, limit } = req.query;
        const response = await filmController.getAllFilms({ search, page: parseInt(page), limit: parseInt(limit) });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving films: " + error.message });
    }
});

/**
 * @openapi
 * /api/films/{id}:
 *   get:
 *     tags:
 *       - Films
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
        const film = await filmController.getFilmById(req.params.id);
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
 *     tags:
 *       - Films
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
        const { name, description, releaseDate, rating, categoryIds } = req.body;
        const film = await filmController.addFilm(name, description, releaseDate, rating, categoryIds); // add Category IDs To film because film can get multiple categories
        res.status(201).json(film);
    } catch (error) {
        res.status(500).json({ message: "Error adding film", error: error.message });
    }
});



/**
 * @openapi
 * /api/films/{id}:
 *   put:
 *     tags:
 *       - Films
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
        const updatedFilm = await filmController.updateFilm(req.params.id, name, description, releaseDate, rating);
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
 *     tags:
 *       - Films
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
        const film = await filmController.deleteFilm(req.params.id);
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
 * /api/films/add-category:
 *   post:
 *     summary: Add a category to a film
 *     description: This endpoint adds an existing category to an existing film using their MongoDB ObjectIds.
 *     tags:
 *       - Films
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - filmId
 *               - categoryId
 *             properties:
 *               filmId:
 *                 type: string
 *                 description: The MongoDB ObjectId of the film.
 *               categoryId:
 *                 type: string
 *                 description: The MongoDB ObjectId of the category.
 *     responses:
 *       200:
 *         description: Category added successfully to film.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Category added successfully to film'
 *                 film:
 *                   $ref: '#/components/schemas/Film'
 *       400:
 *         description: Bad request if input validation fails.
 *       500:
 *         description: Internal server error if the operation cannot be completed.
 */

router.post('/add-category', async (req, res) => {
    const { filmId, categoryId } = req.body;
    try {
        const updatedFilm = await filmController.addCategoryToFilm(filmId, categoryId);
        res.status(200).json({ message: "Category added successfully to film", film: updatedFilm });
    } catch (error) {
        res.status(500).json({ message: error.message });
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
 *           format: int64
 *           description: The unique identifier for the film.
 *         name:
 *           type: string
 *           description: The name of the film.
 *         description:
 *           type: string
 *           description: A brief description of the film.
 *         releaseDate:
 *           type: string
 *           format: date-time
 *           description: The ISO 8601 date format of the time when the film was released.
 *         rating:
 *           type: integer
 *           format: int32
 *           minimum: 0
 *           maximum: 5
 *           description: The rating of the film, on a scale from 0 (worst) to 5 (best).
 *     FilmInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the film to be created or updated.
 *           maxLength: 128
 *         description:
 *           type: string
 *           description: A detailed description of the film.
 *           maxLength: 2048
 *         releaseDate:
 *           type: string
 *           format: date-time
 *           description: The ISO 8601 date format of the time when the film is to be released.
 *         rating:
 *           type: integer
 *           format: int32
 *           minimum: 0
 *           maximum: 5
 *           description: The rating of the film, from 0 to 5.
 */


module.exports = router;