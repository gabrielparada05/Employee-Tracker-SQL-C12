INSERT INTO department (name_dep)
VALUES ("Production"),  
       ("HR");
       ("Sales")
       

INSERT INTO role_t (title, dept_id, salary)
VALUES ("Manager", 1, 130000.00), 
       ("Junior Developer", 2, 80000.00),
       ("Senior Developer", 2, 12000.00);
       
INSERT INTO manager (first_name, last_name, role_id)
VALUES ("Karen", "Doe", 1),   
       ("Peter", "Clean", 2);

INSERT INTO employee (first_name, last_name, role_id, man_id)
VALUES ("Gabriel", "Parada", 1, 1),   
       ("Josh", "Doe", 1, 1);

