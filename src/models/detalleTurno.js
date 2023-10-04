const DataTypes = require('sequelize').DataTypes;

const DetalleTurnoAttributes = {
    idDetalleTurno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    diaHoraInicio: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "La fecha de inicio no puede estar vacía"
            }
        }
    },
    idTurnoAtrasado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "El id de detalle del turno no puede estar vacío"
            }
        }
    },
    idZonaInicio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "El id de zona de inicio no puede estar vacío"
            }
        }
    }
}

const DetalleTurnoOptions = {
    tableName: "detalleturno",
    timestamps: false
}

const DetalleTurnoModel = {
    DetalleTurnoAttributes,
    DetalleTurnoOptions
}

module.exports = DetalleTurnoModel;