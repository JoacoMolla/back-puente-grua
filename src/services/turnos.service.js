const db = require("../models/database.js");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const transformarFechaACadena = (fecha) => {
    return `${fecha.toLocaleDateString()}` + ' ' +
    `${fecha.toLocaleTimeString()}`
}

const getAll = async () => {
    const resultado = await db.models.turnos.findAll({
        attributes: [
            'idTurno',
            'fechaHoraCreacion',
            'usuarioLegajo',
            'adminLegajo'
        ],
        order: [['idTurno', 'ASC']],

        include: [
            // Detalle turno y sus pk y fk
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
            },
            // Estado del turno
            {
                model: db.models.estadoturno,
                as: 'estadoturno',
                attributes: ['idEstadoTurno', 'descripcion'],
                include: [
                    {
                        model: db.models.nombreestadoturno,
                        as: 'nombreestadoturno',
                        attributes: ['idNombreEstadoTurno', 'nombre']
                    }
                ]
            }
        ]
    });
    return resultado.map((t) => {
        return {
            turno: {
                idTurno: t.dataValues.idTurno,
                fechaHoraCreacion: new Date(t.dataValues.fechaHoraCreacion).toString(),
                usuarioLegajo: t.dataValues.usuarioLegajo,
                adminLegajo: t.dataValues.adminLegajo
            },
            detalleTurno: {
                idDetalleTurno: t.dataValues.idDetalleTurno,
                diaHoraInicio: transformarFechaACadena(new Date(t.dataValues.detalleturno.diaHoraInicio)),
                idZonaInicio: t.dataValues.detalleturno.idZonaInicio
            },
            turnoAtrasado: {
                esAtrasado: t.dataValues.detalleturno.turnoatrasado.esAtrasado,
                minutosAtrasado: t.dataValues.detalleturno.turnoatrasado.minutosAtrasado,
            },
            estadoTurno: {
                idEstadoTurno: t.dataValues.estadoturno.idEstadoTurno,
                descripcion: t.dataValues.estadoturno.descripcion,
            },
            nombreEstadoTurno: {
                idNombreEstadoTurno: t.dataValues.estadoturno.nombreestadoturno.idNombreEstadoTurno,
                nombre: t.dataValues.estadoturno.nombreestadoturno.nombre
            },
        }
    });
}

const turnosService = {
    getAll
};

module.exports = turnosService;