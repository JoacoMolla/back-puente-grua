const BaseRepository = require("./BaseRepository.js");
const db = require("../models/database.js");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

class Turno extends BaseRepository {

    constructor() {
        super(db.models.turnos);
    }

    async mostrarDatos() {
        
    }
}