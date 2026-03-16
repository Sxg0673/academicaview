const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const usuariosController = require('./src/controllers/usuariosController');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use(usuariosController);

app.listen(3001, () => {
  console.log('ms-usuarios corriendo en puerto 3001');
});
