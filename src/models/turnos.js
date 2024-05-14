const DataTypes = require('sequelize').DataTypes;

const TurnosAttributes = {
    idTurno: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    fechaHoraCreacion: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "La fecha de creación no puede estar vacía"
            }
        }
    },
    idDetalleTurno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "El id de detalle del turno no puede estar vacío"
            }
        }
    },
    idEstadoTurno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "El id de estado del turno no puede estar vacío"
            }
        }
    },
    usuarioLegajo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "El legajo del usuario no puede estar vacío"
            }
        }
    },
    adminLegajo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "El legajo del administrador no puede estar vacío"
            }
        }
    }
}

const TurnosOptions = {
    tableName: "Turnos",
    timestamps: false
}

const TurnosModel = {
    TurnosAttributes,
    TurnosOptions
}

module.exports = TurnosModel;