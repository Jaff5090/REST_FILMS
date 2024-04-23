
const express = require('express');
const connectDB = require('./config/db');

const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const filmRoutes = require('./routes/films');
const swaggerSpec = require('./swaggerConfig');
const app = express();



dotenv.config()
connectDB();

app.use(express.json());
app.use('/api/films', filmRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.all('*', (req, res) => { 
    res.status(404).send('<h1>Error 404 : Page not found !</h1>'); 
  }); 


app.listen(3000, () => {
    console.log('Server started on http://localhost:3000/api/films');
    console.log('Access the MovieDevoir API documentation at http://localhost:3000/api-docs');
});
