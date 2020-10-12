USE employee_trackerdb;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("nay", "Wilkins", 2, 1);

INSERT INTO department (name)
VALUES ("back-end"), ("front-end"), ("busboy");

INSERT INTO role (title, salary, department_id)
VALUES ("React Developer", 2000000, 2);

