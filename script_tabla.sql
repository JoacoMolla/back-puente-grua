DROP DATABASE IF EXISTS puentegrua;

-- MariaDB Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema PuenteGrua
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema PuenteGrua
-- -----------------------------------------------------
CREATE DATABASE IF NOT EXISTS PuenteGrua DEFAULT CHARACTER SET utf8mb4;
USE PuenteGrua;

-- -----------------------------------------------------
-- Table `PuenteGrua`.`TurnoAtrasado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS TurnoAtrasado (
  idTurnoAtrasado INT NOT NULL AUTO_INCREMENT,
  esAtrasado TINYINT,
  minutosAtrasado INT,
  PRIMARY KEY (idTurnoAtrasado)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `PuenteGrua`.`FormatoZonas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS FormatoZonas (
  idFormatoZonas INT NOT NULL AUTO_INCREMENT,
  esVigente TINYINT,
  fechaCreacion DATETIME NOT NULL,
  PRIMARY KEY (idFormatoZonas)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `PuenteGrua`.`Zonas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Zonas (
  idZona INT NOT NULL AUTO_INCREMENT,
  numeroZona INT NOT NULL,
  idFormatoZonas INT NOT NULL,
  PRIMARY KEY (idZona, idFormatoZonas),
  INDEX fk_Zonas_FormatoZonas1_idx (idFormatoZonas ASC) VISIBLE,
  CONSTRAINT fk_Zonas_FormatoZonas1
    FOREIGN KEY (idFormatoZonas)
    REFERENCES FormatoZonas (idFormatoZonas)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `PuenteGrua`.`DetalleTurno`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS DetalleTurno (
  idDetalleTurno INT NOT NULL AUTO_INCREMENT,
  diaHoraInicio DATETIME NOT NULL,
  idTurnoAtrasado INT NOT NULL,
  idZonaInicio INT NOT NULL,
  PRIMARY KEY (idDetalleTurno, idTurnoAtrasado, idZonaInicio),
  INDEX fk_DetalleTurno_TurnoAtrasado1_idx (idTurnoAtrasado ASC) VISIBLE,
  INDEX fk_DetalleTurno_Zonas1_idx (idZonaInicio ASC) VISIBLE,
  CONSTRAINT fk_DetalleTurno_TurnoAtrasado1
    FOREIGN KEY (idTurnoAtrasado)
    REFERENCES TurnoAtrasado (idTurnoAtrasado)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_DetalleTurno_Zonas1
    FOREIGN KEY (idZonaInicio)
    REFERENCES Zonas (idZona)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `PuenteGrua`.`NombreEstadoTurno`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS NombreEstadoTurno (
  idNombreEstadoTurno INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(45) NOT NULL,
  PRIMARY KEY (idNombreEstadoTurno)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `PuenteGrua`.`EstadoTurno`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS EstadoTurno (
  idEstadoTurno INT NOT NULL AUTO_INCREMENT,
  descripcion VARCHAR(100) NOT NULL,
  idNombreEstadoTurno INT NOT NULL,
  PRIMARY KEY (idEstadoTurno, idNombreEstadoTurno),
  INDEX fk_EstadoTurno_NombreEstadoTurno1_idx (idNombreEstadoTurno ASC) VISIBLE,
  CONSTRAINT fk_EstadoTurno_NombreEstadoTurno1
    FOREIGN KEY (idNombreEstadoTurno)
    REFERENCES NombreEstadoTurno (idNombreEstadoTurno)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `PuenteGrua`.`TipoUsuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS TipoUsuario (
  idTipoUsuario INT NOT NULL AUTO_INCREMENT,
  descripcion VARCHAR(45) NOT NULL,
  PRIMARY KEY (idTipoUsuario)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `PuenteGrua`.`Administrador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Administrador (
  legajo INT NOT NULL AUTO_INCREMENT,
  password VARCHAR(100) NOT NULL,
  nombre VARCHAR(45),
  idTipoUsuario INT NOT NULL,
  PRIMARY KEY (legajo, idTipoUsuario),
  INDEX fk_Administrador_TipoUsuario1_idx (idTipoUsuario ASC) VISIBLE,
  CONSTRAINT fk_Administrador_TipoUsuario1
    FOREIGN KEY (idTipoUsuario)
    REFERENCES TipoUsuario (idTipoUsuario)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `PuenteGrua`.`Usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Usuarios (
  legajo INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(50),
  apellido VARCHAR(50) NOT NULL,
  email VARCHAR(60) NOT NULL,
  dadoDeBaja TINYINT NOT NULL,
  adminLegajo INT NOT NULL,
  idTipoUsuario INT NOT NULL,
  password VARCHAR(100) NOT NULL,
  PRIMARY KEY (legajo, adminLegajo, idTipoUsuario),
  INDEX fk_Usuarios_Administrador1_idx (adminLegajo ASC) VISIBLE,
  INDEX fk_Usuarios_TipoUsuario1_idx (idTipoUsuario ASC) VISIBLE,
  CONSTRAINT fk_Usuarios_Administrador1
    FOREIGN KEY (adminLegajo)
    REFERENCES Administrador (legajo)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_Usuarios_TipoUsuario1
    FOREIGN KEY (idTipoUsuario)
    REFERENCES TipoUsuario (idTipoUsuario)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `PuenteGrua`.`Turnos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Turnos (
  idTurno INT NOT NULL AUTO_INCREMENT,
  fechaHoraCreacion DATETIME NOT NULL,
  idDetalleTurno INT NOT NULL,
  idEstadoTurno INT NOT NULL,
  usuarioLegajo INT NOT NULL,
  adminLegajo INT NOT NULL,
  PRIMARY KEY (idTurno, idDetalleTurno, idEstadoTurno, usuarioLegajo, adminLegajo),
  INDEX fk_Turnos_DetalleTurno_idx (idDetalleTurno ASC) VISIBLE,
  INDEX fk_Turnos_EstadoTurno1_idx (idEstadoTurno ASC) VISIBLE,
  INDEX fk_Turnos_Usuarios1_idx (usuarioLegajo ASC) VISIBLE,
  INDEX fk_Turnos_Administrador1_idx (adminLegajo ASC) VISIBLE,
  CONSTRAINT fk_Turnos_DetalleTurno
    FOREIGN KEY (idDetalleTurno)
    REFERENCES DetalleTurno (idDetalleTurno)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_Turnos_EstadoTurno1
    FOREIGN KEY (idEstadoTurno)
    REFERENCES EstadoTurno (idEstadoTurno)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_Turnos_Usuarios1
    FOREIGN KEY (usuarioLegajo)
    REFERENCES Usuarios (legajo)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_Turnos_Administrador1
    FOREIGN KEY (adminLegajo)
    REFERENCES Administrador (legajo)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `PuenteGrua`.`Sesiones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Sesiones (
  idSesion INT NOT NULL AUTO_INCREMENT,
  fechaHoraInicio DATETIME NOT NULL,
  fechaHoraFin DATETIME,
  usuarioLegajo INT NOT NULL,
  adminLegajo INT NOT NULL,
  PRIMARY KEY (idSesion, usuarioLegajo, adminLegajo),
  INDEX fk_Sesiones_Usuarios1_idx (usuarioLegajo ASC, adminLegajo ASC) VISIBLE,
  CONSTRAINT fk_Sesiones_Usuarios1
    FOREIGN KEY (usuarioLegajo, adminLegajo)
    REFERENCES Usuarios (legajo, adminLegajo)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

USE PuenteGrua;

-- --------------------- datos mock ---------------------

-- tipo usuario
INSERT INTO TipoUsuario (idTipoUsuario, descripcion)
VALUES (1, 'administrador'),
(2, 'usuario comun');

-- admin
INSERT INTO Administrador (legajo, password, nombre, idTipoUsuario)
VALUES (1, '1234', 'Juan', 1);

-- usuario
INSERT INTO Usuarios (legajo, nombre, apellido, email, dadoDeBaja, adminLegajo, idTipoUsuario, password)
VALUES (2, 'Pedro', 'Casas', 'pcasas@gmail.com', 0, 1, 2, '1234');

-- --------------------- zonas ---------------------
INSERT INTO FormatoZonas (idFormatoZonas, esVigente, fechaCreacion)
VALUES (1, 1, CURRENT_TIMESTAMP());

INSERT INTO Zonas (idZona, numeroZona, idFormatoZonas)
VALUES (1, 1, 1),
(2, 2, 1),
(3, 3, 1),
(4, 4, 1);

-- --------------------- estados de un turno ---------------------

INSERT INTO NombreEstadoTurno (idNombreEstadoTurno, nombre)
VALUES (1, 'Creado'),
(2, 'Cancelado'),
(3, 'Ejecutado');
