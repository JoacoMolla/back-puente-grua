const Express = require('express');
const router = Express.Router();
const zonasService = require('../services/zonas.service.js');

router.get('', async function (req, res) {
    let data = {};

    data = await zonasService.getZonasValidas();
    res.json(data);
})

const zonasRouter = { router };

module.exports = zonasRouter;