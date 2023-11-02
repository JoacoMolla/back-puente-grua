const Express = require('express');
const router = Express.Router();
const turnosService = require('../services/turnos.service.js');

router.get('', async function (req, res) {
    let data = {};

    data = await turnosService.getAll();
    res.json(data);

});

router.post('', async function (req, res) {
    try {
        let data = await turnosService.postNuevoTurno(req.body);
        res
            .status(200)
            .json(data)
    } catch (err) {
        res.json(err)
    }
})

router.delete('', async function (req, res) {
    try {
        let data = {}
        let filtro = req.query
        data = await turnosService.deleteTurno(filtro.idTurno);
        res
            .status(200)
            .json(data);
    } catch (err) {
        res.json(err)
    }
})

const turnosRouter = { router };

module.exports = turnosRouter;