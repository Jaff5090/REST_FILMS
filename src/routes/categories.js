const express = require('express');
const router = express.Router();
const categ = require('../models/categories');

/**
 * @openapi
 * /api/categories:
 *   get:
 *     summary: Get a list of all categories
 *     responses:
 *       200:
 *         description: A list of categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categories'
 */
  router.get('/', async (req, res) => {
    try {
        const cat = await categ.getAllCategories();
        res.status(200).json(cat);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving categories : ", error: error.message });
    }
});

module.exports = router;