const Express = require('express');
const router = Express.Router();
const turnosService = require('../services/turnos.service.js');

router.get('', async function (req, res) {
    let data = {};

    data = await turnosService.getAll();
    res.json(data);

});

const turnosRouter = { router };

module.exports = turnosRouter;