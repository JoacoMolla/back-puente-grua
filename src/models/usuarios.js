const DataTypes = require('sequelize').DataTypes;

const UsuariosAttributes = {
    legajo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "El nombre del usuario no puede estar vacío"
            }
        }
    },
    apellido: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "El apellido del usuario no puede estar vacío"
            }
        }
    },
    email: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "El email del usuario no puede estar vacío"
            }
        }
    },
    dadoDeBaja: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
    },
    adminLegajo: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    idTipoUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}

const UsuariosOptions = {
    tableName: 'usuarios',
    timestamps: false
}

const UsuariosModel = {
    UsuariosAttributes,
    UsuariosOptions
}

module.exports = UsuariosModel;