DROP DATABASE IF EXISTS humanResources_db;
CREATE DATABASE humanResources_db;

USE humanResources_db;

CREATE TABLE department (
  id_dep   INT AUTO_INCREMENT PRIMARY KEY,
  name_dep VARCHAR(30)
);


CREATE TABLE role_t (
  id_role INT AUTO_INCREMENT PRIMARY KEY ,
  title VARCHAR(30) ,
  salary DECIMAL(20, 2),
  dept_id INT,
  FOREIGN KEY (dept_id) REFERENCES department(id_dep) ON DELETE SET NULL 
  );

CREATE TABLE manager (
  id_man  INT  AUTO_INCREMENT PRIMARY KEY,
  first_name  VARCHAR(30) NOT NULL,
  last_name   VARCHAR(30) NOT NULL,
  role_id     INT NOT NULL,
  FOREIGN KEY (role_id) REFERENCES role_t(id_role)
);

CREATE TABLE employee (
  id_emp      INT AUTO_INCREMENT PRIMARY KEY,
  first_name  VARCHAR(30) NOT NULL,
  last_name   VARCHAR(30) NOT NULL,
  role_id     INT,
  man_id  INT,
  FOREIGN KEY (role_id) REFERENCES role_t(id_role) ON DELETE SET NULL,
  FOREIGN KEY (man_id) REFERENCES manager(id_man) ON DELETE SET NULL
  
);

