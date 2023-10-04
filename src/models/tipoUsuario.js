const DataTypes = require('sequelize').DataTypes;

const TipoUsuarioAttributes = {
    idTipoUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    descripcion: {
        type: DataTypes.STRING(45),
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "La descripción del tipo de usuario no puede estar vacía"
            }
        }
    }
}

const TipoUsuarioOptions = {
    tableName: 'tipousuario',
    timestamps: false
}

const TipoUsuarioModel = {
    TipoUsuarioAttributes,
    TipoUsuarioOptions
}

module.exports = TipoUsuarioModel;