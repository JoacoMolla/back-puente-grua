const DataTypes = require('sequelize').DataTypes;

const ZonasAttributes = {
    idZona: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    numeroZona: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "El número de la zona no puede estar vacío"
            }
        }
    },
    idFormatoZonas: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}

const ZonasOptions = {
    tableName: 'zonas',
    timestamps: false
}

const ZonasModel = {
    ZonasAttributes,
    ZonasOptions
}

module.exports = ZonasModel;