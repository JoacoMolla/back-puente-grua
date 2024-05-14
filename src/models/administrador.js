const DataTypes = require('sequelize').DataTypes;

const AdministradorAttributes = {
    legajo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(45),
    },
    idTipoUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "El id del tipo de usuario no puede estar vacío"
            }
        }
    }
}

const AdministradorOptions = {
    tableName: 'Administrador',
    timestamps: false
}

const AdministradorModel = {
    AdministradorAttributes,
    AdministradorOptions
}

module.exports = AdministradorModel;