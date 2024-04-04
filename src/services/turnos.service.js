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
                    },
                    {
                        model: db.models.zonas,
                        as: 'zona',
                        attributes: ['idZona', 'numeroZona']
                    }
                ],
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
        ],
        order: [[
            //{model: db.models.turno, as: 'turnos'},
            { model: db.models.detalleturno, as: 'detalleturno' },
            'diaHoraInicio',
            'ASC'
        ]],
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
    fechaActual = new Date();
    return resultado
    .filter((t) => { // Filtra todos los turnos que sean solamente para hoy
        fechaInicioTurno = new Date(t.dataValues.detalleturno.diaHoraInicio);
        return (
            fechaActual.getDate() == fechaInicioTurno.getDate() &&
            fechaActual.getMonth() == fechaInicioTurno.getMonth() &&
            fechaActual.getFullYear() == fechaInicioTurno.getFullYear() &&
            fechaActual.getHours() >= fechaInicioTurno.getHours() &&
            fechaActual.getMinutes() <= fechaInicioTurno.getMinutes()
        )
    })
    .map((t) => {
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
            zonaInicial: {
                nroZonaInicial: t.dataValues.detalleturno.zona.dataValues.numeroZona
            }
        }
    });
}

const getUnTurno = async (idTurno) => {
    const resultado = await db.models.turnos.findOne({
        attributes: [
            "idTurno"
        ],
        include: [
            {
                model: db.models.detalleturno,
                as: 'detalleturno',
                attributes: ['idDetalleTurno', 'idTurnoAtrasado',],
                include: [
                    {
                        model: db.models.turnoatrasado,
                        as: 'turnoatrasado',
                        attributes: ['idTurnoAtrasado']
                    }
                ]
            },
            {
                model: db.models.estadoturno,
                as: 'estadoturno',
                attributes: ['idEstadoTurno'],
            },
        ],
        where: {
            idTurno: idTurno
        }
    })

    return {
        idTurno: resultado.dataValues.idTurno,
        idDetalleTurno: resultado.dataValues.detalleturno.idDetalleTurno,
        idTurnoAtrasado: resultado.dataValues.detalleturno.turnoatrasado.idTurnoAtrasado,
        idEstadoTurno: resultado.dataValues.estadoturno.idEstadoTurno
    }
}

const getTurnoNoAtrasado = async (horaInicio) => {
    const resultado = await db.models.turnos.findOne({
        attributes: [
            "idTurno"
        ],
        include: [
            {
                model: db.models.estadoturno,
                as: 'estadoturno',
                attributes: ['idEstadoTurno'],
                where: {
                    idNombreEstadoTurno: [1, 3]
                }
            },
            {
                model: db.models.detalleturno,
                as: 'detalleturno',
                attributes: ['diaHoraInicio'],
                where: {
                    diaHoraInicio: horaInicio
                }
            }
        ]
    })

    if (!resultado) {
        return null
    }

    return {
        idTurno: resultado.dataValues.idTurno
    }
}

const postNuevoTurno = async (datosTurno) => {

    const turnoNoCancelados = await getTurnoNoAtrasado(new Date(datosTurno.fechaInicioTurno
        + ' ' + datosTurno.horaTurno));

    if (turnoNoCancelados) {
        return { error: "Ya existe un turno con ese horario." }
    }

    const resultado = await db.transaction(async (t) => {
        const turnoAtrasado = await db.models.turnoatrasado.create({
            esAtrasado: 0,
            minutosAtrasado: 0
        }, { transaction: t });

        const detalleTurno = await db.models.detalleturno.create({
            diaHoraInicio: new Date(datosTurno.fechaInicioTurno + ' ' + datosTurno.horaTurno),
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

const deleteTurno = async (datosTurno) => {

    const turnoExistente = await getUnTurno(datosTurno);

    // Obtener los detalles del turno para eliminar
    if (!turnoExistente) {
        return { message: "No existe el turno seleccionado." }
    }
    const resultado = await db.transaction(async (t) => {

        const turno = await db.models.turnos.destroy({
            where: {
                idTurno: turnoExistente.idTurno
            }
        }, { transaction: t });

        const estadoTurno = await db.models.estadoturno.destroy({
            where: {
                idEstadoTurno: turnoExistente.idEstadoTurno
            }
        }, { transaction: t })

        const detalleTurno = await db.models.detalleturno.destroy({
            where: {
                idDetalleTurno: turnoExistente.idDetalleTurno
            }
        }, { transaction: t })

        const turnoAtrasado = await db.models.turnoatrasado.destroy({
            where: {
                idTurnoAtrasado: turnoExistente.idTurnoAtrasado
            }
        }, { transaction: t })

    })
    return { message: "Turno eliminado con éxito." }
}

const updateTurnoCancelado = async (datosTurno, descripcion) => {
    console.log(datosTurno)
    const turnoExistente = await getUnTurno(datosTurno);

    if (!turnoExistente) {
        return { message: "No existe el turno seleccionado." }
    }

    /**
    Query de MySQL
    update estadoturno e
    join turnos t on (t.idEstadoTurno = e.idEstadoTurno)
    set descripcion = 'Turno cancelado', idNombreEstadoTurno = 2
    where t.idTurno = 23
     */

    const resultado = await db.transaction(async (t) => {
        const estadoTurno = await db.models.estadoturno.update(
            {
                descripcion: descripcion,
                idNombreEstadoTurno: 2
            },
            {
                where: { idEstadoTurno: datosTurno }
            }, { transaction: t })
    })

    return { message: "Turno cancelado con éxito." }
}

const updateTurnoEjecutado = async (datosTurno, descripcion) => {
    const turnoExistente = await getUnTurno(datosTurno);

    if (!turnoExistente) {
        return { message: "No existe el turno seleccionado." }
    }

    const resultado = await db.transaction(async (t) => {
        const estadoTurno = await db.models.estadoturno.update(
            {
                descripcion: descripcion,
                idNombreEstadoTurno: 3
            },
            {
                where: { idEstadoTurno: datosTurno }
            }, { transaction: t })
    })

    return { message: "Turno ejecutado con éxito." }
}

const findAllTurnosCreadosParaHoy = async () => {
    fechaActual = new Date();
    const allTurnos = await db.models.turnos.findAll({
        attributes: [
            'idTurno',
        ],
        include: [
            {
                model: db.models.detalleturno,
                as: 'detalleturno',
                attributes: ['diaHoraInicio', 'idZonaInicio'],
                include: [
                    {
                        model: db.models.turnoatrasado,
                        as: 'turnoatrasado',
                        attributes: ['idTurnoAtrasado', 'esAtrasado', 'minutosAtrasado']
                    },
                    {
                        model: db.models.zonas,
                        as: 'zona',
                        attributes: ['idZona', 'numeroZona']
                    }
                ],
            },
            {
                model: db.models.estadoturno,
                as: 'estadoturno',
                attributes: ['idEstadoTurno'],
                where: {
                    idNombreEstadoTurno: [1]
                }
            }
        ]
    })

    return allTurnos
    .filter((t) => { // Filtra todos los turnos que sean solamente para hoy
        fechaInicioTurno = new Date(t.dataValues.detalleturno.diaHoraInicio);
        return (
            fechaActual.getDate() == fechaInicioTurno.getDate() &&
            fechaActual.getMonth() == fechaInicioTurno.getMonth() &&
            fechaActual.getFullYear() == fechaInicioTurno.getFullYear() &&
            fechaActual.getHours() >= fechaInicioTurno.getHours() &&
            fechaActual.getMinutes() < fechaInicioTurno.getMinutes()
        )
    })
    .map((t) => {
            return {
                idTurno: t.dataValues.idTurno,
                diaHoraInicio: t.dataValues.detalleturno.diaHoraInicio,
                idNombreEstadoTurno: 1,
                nroZonaInicial: t.dataValues.detalleturno.zona.dataValues.numeroZona
            }
        }
    )
}

const getSiguiente = async () => {
    const allTurnosCreados = await findAllTurnosCreadosParaHoy();
    if (allTurnosCreados.length === 0) {
        return { error: "No hay turnos creados para hoy." };	
    }

    console.log(allTurnosCreados)

    let turno = allTurnosCreados[0];
    let menorDiferenciaHoras = Math.abs((new Date(turno.diaHoraInicio) - new Date()));
    
    for (let i = 1; i < allTurnosCreados.length; i++) {
        const fechaTurno = new Date(allTurnosCreados[i].diaHoraInicio);
        const diferenciaHoras = Math.abs((fechaTurno - new Date()));

        if (diferenciaHoras < menorDiferenciaHoras) {
            turno = allTurnosCreados[i];
            menorDiferenciaHoras = diferenciaHoras;
        }
    }
    
    return {
        idTurno: turno.idTurno,
        fechaHoraInicio: `${new Date(turno.diaHoraInicio).toLocaleDateString()}` + ' ' 
        + `${new Date(turno.diaHoraInicio).toLocaleTimeString()}`,
        idNombreEstadoTurno: 1,
        nroZonaInicial: turno.nroZonaInicial

    }
}


const turnosService = {
    getAll,
    postNuevoTurno,
    deleteTurno,
    updateTurnoCancelado,
    updateTurnoEjecutado,
    getSiguiente
};

module.exports = turnosService;