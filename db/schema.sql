DROP DATABASE IF EXISTS humanResources_db;
CREATE DATABASE humanResources_db;

USE humanResources_db;

CREATE TABLE department (
  id_dep   INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  name_dep VARCHAR(30) NOT NULL
);

CREATE TABLE role_t (
  id_role            INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  title         VARCHAR(30) NOT NULL,
  salary        DECIMAL (20,2),
  dept_id INT,
  FOREIGN KEY (dept_id) REFERENCES department(id_dep)
);

CREATE TABLE manager (
  id_man  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  f_name  VARCHAR(30) NOT NULL,
  l_name   VARCHAR(30) NOT NULL,
  role_id     INT NOT NULL,
  FOREIGN KEY (role_id) REFERENCES role_t(id_role)
);

CREATE TABLE employee (
  id_emp      INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  f_name  VARCHAR(30) NOT NULL,
  l_name   VARCHAR(30) NOT NULL,
  role_id     INT NOT NULL,
  man_id  INT,
  FOREIGN KEY (role_id) REFERENCES role_t(id_role),
  FOREIGN KEY (man_id) REFERENCES manager(id_man)
);

