require('dotenv').config()
const express = require('express');
const cors = require('cors');

const turnosRouter = require('./src/routes/turnos.router');
const zonasRouter = require('./src/routes/zonas.router');

const app = express();
app
    .use(express.json())
    .use(cors());

app
    .use('/turnos', turnosRouter.router)
    .use('/zonas', zonasRouter.router);

const port = 3100;

const server = app.listen(port, () => {
    console.log('Api escuchando en el puerto: ', port)
})