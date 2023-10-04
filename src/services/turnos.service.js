const db = require("../models/database.js");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const getAll = async () => {
    const resultado = await db.models.turnos.findAll({
        attributes: [
            'idTurno',
            'fechaHoraCreacion',
            'idDetalleTurno',
            'idEstadoTurno',
            'usuarioLegajo',
            'adminLegajo'
        ],
        order: [['idTurno', 'ASC']],
        include: [
            {
                model: db.models.detalleturno,
                as: 'detalleturno',
                attributes: ['idDetalleTurno', 'diaHoraInicio', 'idTurnoAtrasado', 'idZonaInicio'],
                include: [
                    {
                        model: db.models.turnoatrasado,
                        as: 'turnoatrasado',
                        attributes: ['idTurnoAtrasado', 'esAtrasado', 'minutosAtrasado']
                    }
                ]
            }
        ]
    });
    return resultado.map((t) => {
        return {
            idTurno: t.dataValues.idTurno,
            fechaHoraCreacion: t.dataValues.fechaHoraCreacion,
            idDetalleTurno: t.dataValues.idDetalleTurno,
            idEstadoTurno: t.dataValues.idEstadoTurno,
            usuarioLegajo: t.dataValues.usuarioLegajo,
            adminLegajo: t.dataValues.adminLegajo,
            detalleturno: t.dataValues.detalleturno
        }
    });
}

const turnosService = {
    getAll
};

module.exports = turnosService;