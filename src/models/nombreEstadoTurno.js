const DataTypes = require('sequelize').DataTypes;

const NombreEstadoTurnoAttributes = {
    idNombreEstadoTurno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING(45),
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "El nombre del estado de turno no puede estar vacío"
            }
        }
    }
}

const NombreEstadoTurnoOptions = {
    tableName: 'NombreEstadoTurno',
    timestamps: false
}

const NombreEstadoTurnoModel = {
    NombreEstadoTurnoAttributes,
    NombreEstadoTurnoOptions
}

module.exports = NombreEstadoTurnoModel;