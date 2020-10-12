USE employee_trackerdb;

INSERT INTO department (name)
VALUES ("front-end"), ("back-end"), ("sales"), ("management");

INSERT INTO role (title, salary, department_id)
VALUES ("React Developer", 1800000, 1), ("Node Developer", 2000000, 2), ("liquid specialist", 120000, 3), ("District Manager", 2000000, 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("barbara", "stussy", 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("nay", "Wilkins", 1, 4),("claire", "puckett", 2, 4),("doug", "stevens", 3, 4);

