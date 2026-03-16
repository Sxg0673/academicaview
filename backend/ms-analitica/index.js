const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const analiticaController = require('./src/controllers/analiticaController');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use(analiticaController);

app.listen(3003, () => {
  console.log('ms-analitica corriendo en puerto 3003');
});
