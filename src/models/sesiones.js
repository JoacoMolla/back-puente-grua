const DataTypes = require('sequelize').DataTypes;

const SesionesAttributes = {
    idSesion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    fechaHoraInicio: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    fechaHoraFin: {
        type: DataTypes.DATE,
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

const SesionesOptions = {
    tableName: "Sesiones",
    timestamps: false
}

const SesionesModel = {
    SesionesAttributes,
    SesionesOptions
}

module.exports = SesionesModel;