const DataTypes = require('sequelize').DataTypes;

const FormatoZonasAttributes = {
    idFormatoZonas: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    esVigente: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    },
    fechaCreacion: {
        type: DataTypes.DATE,
        allowNull: false
    }
}

const FormatoZonasOptions = {
    tableName: 'formatozonas',
    timestamps: false
}

const FormatoZonasModel = {
    FormatoZonasAttributes,
    FormatoZonasOptions
}

module.exports = FormatoZonasModel;