-- Schema de la base de datos academicaview
-- MariaDB 10.4.28

CREATE DATABASE IF NOT EXISTS academicaview;
USE academicaview;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('estudiante', 'profesor') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE estudiantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  horas_estudio DECIMAL(5,2),
  promedio_previo DECIMAL(4,2),
  horas_sueno DECIMAL(4,2),
  modalidad ENUM('Presencial', 'Virtual'),
  asistencia DECIMAL(5,2),
  uso_redes DECIMAL(4,2),
  puntaje_real DECIMAL(6,2),
  puntaje_estimado DECIMAL(6,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
