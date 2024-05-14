const DataTypes = require('sequelize').DataTypes;

const EstadoTurnoAttributes = {
    idEstadoTurno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, 
        autoIncrement: true
    },
    descripcion: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "La descripción del estado de turno no puede estar vacía"
            }
        }
    },
    idNombreEstadoTurno: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}

const EstadoTurnoOptions = {
    tableName: 'EstadoTurno',
    timestamps: false
}

const EstadoTurnoModel = {
    EstadoTurnoAttributes,
    EstadoTurnoOptions
}

module.exports = EstadoTurnoModel;