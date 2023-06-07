INSERT INTO department (name_dep)
VALUES
  ('Production'),
  ('HR'),
  ('Sales'),
  ('Legal'),
  ('IT');

INSERT INTO role_t (title, dept_id, salary)
VALUES
  ('Manager', 1, 130000.00),
  ('Junior Developer', 5, 80000.00),
  ('Clerk', 2, 60000.00),
  ('Senior Developer', 5, 120000.00),
  ('Accountant', 3, 90000.00);
       
INSERT INTO manager (first_name, last_name, role_id)
VALUES
  ('John', 'Doe', 1),
  ('Jane', 'Smith', 1),
  ('David', 'Johnson', 1),
  ('Emily', 'Williams', 1),
  ('Michael', 'Brown', 1);


INSERT INTO employee (first_name, last_name, role_id, man_id)
VALUES
  ('Laura', 'Jones', 3, 2),
  ('Eric', 'Wilson', 2, 1),
  ('Emily', 'Davis', 3, 2),
  ('Matthew', 'Anderson', 4, 3),
  ('Sophia', 'Miller', 5, 4),
  ('Olivia', 'Clark', 2, 1),
  ('Daniel', 'Roberts', 3, 2),
  ('Natalie', 'Brown', 4, 3),
  ('Joshua', 'Harris', 5, 4),
  ('Amelia', 'Lee', 2, NULL);