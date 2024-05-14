const Sequelize = require('sequelize');
require('dotenv').config()

// Tablas
const AdministradorModel = require("./administrador.js");
const TipoUsuarioModel = require("./tipoUsuario.js");
const FormatoZonasModel = require("./formatoZonas.js");
const NombreEstadoTurnoModel = require("./nombreEstadoTurno.js");
const SesionesModel = require("./sesiones.js");
const ZonasModel = require("./zonas.js");
const TurnoAtrasadoModel = require("./turnoAtrasado.js");
const TurnoModel = require("./turnos.js");
const UsuarioModel = require("./usuarios.js");
const DetalleTurnoModel = require("./detalleTurno.js");
const EstadoTurnoModel = require("./estadoTurno.js");


const sequelize = new Sequelize(
  // process.env.DATABASE_BANK,
  // process.env.DATABASE_USERNAME,
  // process.env.DATABASE_PASSWORD,
  {
    dialect: MariaDBDialect,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: localhost,
    database: 'puentegrua',
    timezone: '-03:00'
  });

// Modelos
sequelize.define(
  'administrador',
  AdministradorModel.AdministradorAttributes,
  AdministradorModel.AdministradorOptions
);

sequelize.define(
  'tipousuario',
  TipoUsuarioModel.TipoUsuarioAttributes,
  TipoUsuarioModel.TipoUsuarioOptions
);

sequelize.define(
  'formatozonas',
  FormatoZonasModel.FormatoZonasAttributes,
  FormatoZonasModel.FormatoZonasOptions
);

sequelize.define(
  'nombreestadoturno',
  NombreEstadoTurnoModel.NombreEstadoTurnoAttributes,
  NombreEstadoTurnoModel.NombreEstadoTurnoOptions
);

sequelize.define(
  'sesiones',
  SesionesModel.SesionesAttributes,
  SesionesModel.SesionesOptions
);

sequelize.define(
  'zonas',
  ZonasModel.ZonasAttributes,
  ZonasModel.ZonasOptions
);

sequelize.define(
  'turnoatrasado',
  TurnoAtrasadoModel.TurnoAtrasadoAttributes,
  TurnoAtrasadoModel.TurnoAtrasadoOptions
);

sequelize.define(
  'turnos',
  TurnoModel.TurnosAttributes,
  TurnoModel.TurnosOptions
);

sequelize.define(
  'usuarios',
  UsuarioModel.UsuariosAttributes,
  UsuarioModel.UsuariosOptions
);

sequelize.define(
  'detalleturno',
  DetalleTurnoModel.DetalleTurnoAttributes,
  DetalleTurnoModel.DetalleTurnoOptions
);

sequelize.define(
  'estadoturno',
  EstadoTurnoModel.EstadoTurnoAttributes,
  EstadoTurnoModel.EstadoTurnoOptions
);

// Asociaciones

// Turno
sequelize.models.turnos.belongsTo(sequelize.models.detalleturno, {
  foreignKey: 'idDetalleTurno'
})

sequelize.models.turnos.belongsTo(sequelize.models.estadoturno, {
  foreignKey: 'idEstadoTurno'
})

sequelize.models.turnos.belongsTo(sequelize.models.usuarios, {
  foreignKey: 'usuarioLegajo'
})

sequelize.models.turnos.belongsTo(sequelize.models.administrador, {
  foreignKey: 'adminLegajo'
})

// Administrador

sequelize.models.administrador.belongsTo(sequelize.models.tipousuario, {
  foreignKey: 'idTipoUsuario'
})

// Usuario

sequelize.models.usuarios.belongsTo(sequelize.models.tipousuario, {
  foreignKey: 'idTipoUsuario'
})

sequelize.models.usuarios.belongsTo(sequelize.models.administrador, {
  foreignKey: 'adminLegajo'
})

// Detalle turno

sequelize.models.detalleturno.belongsTo(sequelize.models.turnoatrasado, {
  foreignKey: 'idTurnoAtrasado'
})

sequelize.models.detalleturno.belongsTo(sequelize.models.zonas, {
  foreignKey: 'idZonaInicio'
})

// Estado turno

sequelize.models.estadoturno.belongsTo(sequelize.models.nombreestadoturno, {
  foreignKey: 'idNombreEstadoTurno'
})

// Sesiones

sequelize.models.sesiones.belongsTo(sequelize.models.usuarios, {
  foreignKey: 'usuarioLegajo'
})

sequelize.models.sesiones.belongsTo(sequelize.models.administrador, {
  foreignKey: 'adminLegajo'
})

// Zonas

sequelize.models.zonas.belongsTo(sequelize.models.formatozonas, {
  foreignKey: 'idFormatoZonas'
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Conexion exitosa');
  })
  .catch(err => {
    console.error('Error al conectar: ', err);
  });

module.exports = sequelize;