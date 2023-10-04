const DataTypes = require('sequelize').DataTypes;

const TurnoAtrasadoAttributes = {
    idTurnoAtrasado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    esAtrasado: {
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
    minutosAtrasado: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}

const TurnoAtrasadoOptions = {
    tableName: 'turnoatrasado',
    timestamps: false
}

const TurnoAtrasadoModel = {
    TurnoAtrasadoAttributes,
    TurnoAtrasadoOptions
}

module.exports = TurnoAtrasadoModel;