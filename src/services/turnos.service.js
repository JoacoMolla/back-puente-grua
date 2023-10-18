const db = require("../models/database.js");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

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
    /*
    Return sin usar
    return resultado.map((t) => {
        return {
            turno: {
                idTurno: t.dataValues.idTurno,
                fechaHoraCreacion: t.dataValues.fechaHoraCreacion,
                usuarioLegajo: t.dataValues.usuarioLegajo,
                adminLegajo: t.dataValues.adminLegajo
            },
            detalleTurno: {
                idDetalleTurno: t.dataValues.idDetalleTurno,
                diaHoraInicio: t.dataValues.detalleturno.diaHoraInicio,
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
    }
    */
    return resultado.map((t) => {
        return {
            turno: {
                idTurno: t.dataValues.idTurno,
                usuarioLegajo: t.dataValues.usuarioLegajo,
            },
            detalleTurno: {
                diaHoraInicio: t.dataValues.detalleturno.diaHoraInicio,
            },
            nombreEstadoTurno: {
                nombre: t.dataValues.estadoturno.nombreestadoturno.nombre
            },
        }
    });
}

const postNuevoTurno = async (datosTurno) => {
    const resultado = await db.transaction(async (t) => {

        const turnoAtrasado = await db.models.turnoatrasado.create({
            esAtrasado: 0,
            minutosAtrasado: 0
        }, { transaction: t });

        const detalleTurno = await db.models.detalleturno.create({
            diaHoraInicio: datosTurno.fechaInicioTurno + ' ' + datosTurno.horaTurno,
            idTurnoAtrasado: turnoAtrasado.dataValues.idTurnoAtrasado,
            idZonaInicio: datosTurno.zonaInicial
        }, { transaction: t });

        const estadoTurno = await db.models.estadoturno.create({
            descripcion: 'Turno por ejecutar',
            idNombreEstadoTurno: 1
        }, { transaction: t });

        const Turno = await db.models.turnos.create({
            fechaHoraCreacion: new Date(),
            idDetalleTurno: detalleTurno.dataValues.idDetalleTurno,
            idEstadoTurno: estadoTurno.dataValues.idEstadoTurno,
            usuarioLegajo: 2,
            adminLegajo: 1,
        }, { transaction: t });

    })

    return resultado;
}

const turnosService = {
    getAll,
    postNuevoTurno
};

module.exports = turnosService;