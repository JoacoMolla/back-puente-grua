const db = require("../models/database.js");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const getZonasValidas = async () => {
    const resultado = await db.models.zonas.findAll({
        attributes: [
            'idZona',
            'numeroZona',

        ],
        order: [['idZona', 'ASC']],
        include: [
            {
                model: db.models.formatozonas,
                as: 'formatozona',
                attributes: ['idFormatoZonas', 'esVigente'],
                where: {
                    esVigente: 1
                }
            },
        ],
    })
    return resultado.map((z) => {
        return {
                idZona: z.dataValues.idZona,
                numeroZona: z.dataValues.numeroZona
            }
    })
}

const zonasService = {
    getZonasValidas
}

module.exports = zonasService;