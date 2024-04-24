const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Categorie = require('../models/categories');

/**
 * @openapi
 * /api/films:
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
        const categories = await Categorie.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving categories : ", error: error.message });
    }
});