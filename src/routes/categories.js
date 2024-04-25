const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

/**
 * @openapi
 * tags:
 *   name: Categories
 *   description: Operations related to categories in the film catalog.
 */

/**
 * @openapi
 * /api/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get a list of all categories
 *     description: Retrieve a list of all categories with their details.
 *     responses:
 *       200:
 *         description: A successful response with a list of categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categories'
 *       500:
 *         description: Server error retrieving categories.
 */
router.get('/', async (req, res) => {
    try {
        const categories = await categoryController.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving categories", error: error.message });
    }
});

/**
 * @openapi
 * /api/categories/{id}:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get a single category by ID
 *     description: Retrieve detailed information about a specific category by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single category object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categories'
 *       404:
 *         description: Category not found.
 *       500:
 *         description: Server error retrieving the category.
 */
router.get('/:id', async (req, res) => {
    try {
        const category = await categoryController.getCategoryById(req.params.id);
        if (category) {
            res.status(200).json(category);
        } else {
            res.status(404).send('Category not found');
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving category", error: error.message });
    }
});

/**
 * @openapi
 * /api/categories:
 *   post:
 *     tags:
 *       - Categories
 *     summary: Add a new category
 *     description: Create a new category in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category
 *                 example: Horror
 *               description:
 *                 type: string
 *                 description: Description of the category
 *                 example: Contains horror and thriller movies
 *     responses:
 *       201:
 *         description: Category created successfully.
 *       500:
 *         description: Error creating category.
 */
router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCategory = await categoryController.addCategory(name, description);
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: "Error adding category", error: error.message });
    }
});

/**
 * @openapi
 * /api/categories/add-film:
 *   post:
 *     tags:
 *       - Categories
 *     summary: Add a film to a specific category
 *     description: Associate a film with a category by their IDs.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filmId:
 *                 type: string
 *                 description: The MongoDB ObjectId of the film to add.
 *               categoryId:
 *                 type: string
 *                 description: The MongoDB ObjectId of the category to add the film to.
 *     responses:
 *       200:
 *         description: Film added to category successfully.
 *       400:
 *         description: Bad request if the film or category ID is not provided or invalid.
 *       404:
 *         description: Not found if the film or category does not exist.
 *       500:
 *         description: Internal server error.
 */
router.post('/add-film', async (req, res) => {
    const { filmId, categoryId } = req.body;
    if (!filmId || !categoryId) {
        return res.status(400).json({ message: "Film ID and Category ID are required." });
    }
    try {
        const updatedCategory = await categoryController.addFilmToCategory(filmId, categoryId);
        res.status(200).json({ message: "Film added to category successfully", updatedCategory });
    } catch (error) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Error adding film to category", error: error.message });
        }
    }
});

/**
 * @openapi
 * /api/categories/{id}:
 *   delete:
 *     tags:
 *       - Categories
 *     summary: Delete a categorie
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: categorie deleted successfully
 *       404:
 *         description: categorie not found
 */

router.delete('/:id', async (req, res) => {
    try {
        const categorie = await categoryController.deleteCategory(req.params.id);
        if (categorie) {
            res.status(200).json(categorie);
        } else {
            res.status(404).send('categorie not found');
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting categorie", error: error.message });
    }
});

/**
 * @openapi
 * /api/categories/{id}:
 *   put:
 *     tags:
 *       - Categories
 *     summary: Update an existing category
 *     description: Modify details of an existing category by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the category to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the category.
 *               description:
 *                 type: string
 *                 description: Updated description of the category.
 *               films:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: List of updated film IDs associated with this category.
 *     responses:
 *       200:
 *         description: Category updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categories'
 *       400:
 *         description: Invalid request data.
 *       404:
 *         description: Category not found.
 *       500:
 *         description: Internal server error.
 */
router.put('/:id', async (req, res) => {
    try {
        const updatedCategory = await categoryController.updateCategory(req.params.id, req.body);
        res.status(200).json(updatedCategory);
    } catch (error) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: "Category not found", error: error.message });
        } else {
            res.status(500).json({ message: "Error updating category", error: error.message });
        }
    }
});


/**
 * @openapi
 * components:
 *   schemas:
 *     Categories:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier of the category.
 *         name:
 *           type: string
 *           description: The name of the category.
 *         description:
 *           type: string
 *           description: Detailed description of what the category encompasses.
 *         films:
 *           type: array
 *           items:
 *             type: integer
 *             description: List of film IDs associated with this category.
 */

module.exports = router;
