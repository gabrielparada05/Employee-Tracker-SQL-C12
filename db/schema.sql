DROP DATABASE IF EXISTS humanResources_db;
CREATE DATABASE humanResources_db;

USE humanResources_db;

CREATE TABLE department (
  id   INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  name_dep VARCHAR(30) NOT NULL
);

CREATE TABLE role_t (
  id            INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  title         VARCHAR(30) NOT NULL,
  salary        DECIMAL (20,4),
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
  id          INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name  VARCHAR(30) NOT NULL,
  last_name   VARCHAR(30) NOT NULL,
  role_id     INT,
  manager_id  INT NULL,
  FOREIGN KEY (role_id) REFERENCES role_t(id)
);