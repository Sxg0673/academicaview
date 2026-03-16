const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const estudiantesController = require('./src/controllers/estudiantesController');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use(estudiantesController);

app.listen(3002, () => {
  console.log('ms-estudiantes corriendo en puerto 3002');
});
