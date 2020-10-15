const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Hikes479",
    database: "employee_trackerdb"
})

connection.connect(function (err) {
    if (err) throw err;
    console.log("Welcome to your Employee Tracker!" + "\n" + ":)" + "\n" + "securely connected to your database as id " + connection.threadId + "\n");
    runPrompt();
})

function runPrompt() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "what would you like to do?",
            choices: [
                "View All Employees",
                "View All Departments",
                "View All Roles",
                "Add An Employee",
                "Add A Department",
                "Add A Role",
                "Update Employee Role",
                // "View All Employees By Manager",
                // "Remove An Employee",
                // "Update Employee Manager",
                "exit"

            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View All Employees":
                    viewEmployees()
                    break;
                case "View All Departments":
                    viewAllDepartments()
                    break;
                case "View All Roles":
                    viewAllRoles();
                    break;

                // ---------------------------------------------------

                case "Add An Employee":
                    addEmployee();
                    break;
                case "Add A Department":
                    addDepartment()
                    break;
                case "Add A Role":
                    addRole()
                    break;
                // ---------------------------------------------------

                case "Update Employee Role":
                    updateEmployeeRole()
                    break;

                // ---------------------------------------------------

                // case "View All Employees By Manager":
                //     byManager()
                //     break;
                // case "Remove An Employee":
                //     removeEmployee()
                //     break;

                // case "Update Employee Manager":
                //     updateManager()
                //     break;
                case "exit":
                    connection.end()
                    break;
            }
        })
}

//views all employees

function viewEmployees() {
    connection.query(
        "SELECT employee.first_name, employee.last_name, employee.manager_id, role.title, role.salary, department.name FROM employee INNER JOIN role on employee.role_id = role.id INNER JOIN department on role.department_id = department.id", function (err, res) {
            if (err) throw err;

            console.table(res);
            runPrompt();
        })
};

// views all departments


function viewAllDepartments() {

    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;

        console.table(res);
        runPrompt();
    })

};

//views all roles

function viewAllRoles() {

    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;

        console.table(res);
        runPrompt();
    })

};

function addDepartment() {

    inquirer
        .prompt(
            {
                name: "newDepartment",
                type: "input",
                message: "What is the name of the department you'd like to add?"
            }

        ).then(function (answer) {

            connection.query("INSERT INTO department SET ?", { name: answer.newDepartment }, function (err, res) {
                if (err) throw err;
                console.log("new department added")
                runPrompt()
            }
            )
        })

};

function addRole() {
    let departments = [];

    connection.query("SELECT department.name, department.id FROM department", function (err, departmentRes) {
        if (err) throw err;
        departments = departmentRes;

        inquirer
            .prompt([
                {
                    name: "newRoleTitle",
                    type: "input",
                    message: "What is the name of the role you'd like to add?"
                },
                {
                    name: "newRoleSalary",
                    type: "input",
                    message: "What is the salary of the role you're adding?"
                },
                {
                    name: "newRoleDepartment",
                    type: "list",
                    message: "What is the department of the role you're adding?",
                    choices: departments.map((department) => {
                        return {
                            name: department.name,
                            value: department.id
                        }
                    })
                }


            ]).then(function (answer) {

                connection.query("INSERT INTO role SET ?",
                    {
                        title: answer.newRoleTitle,
                        salary: answer.newRoleSalary,
                        department_id: answer.newRoleDepartment

                    }, function (err, res) {
                        if (err) throw err;
                        console.log("new role added")
                        runPrompt();
                    }
                )
            })

    })
}

// add employee

function addEmployee() {
    let roles = [];
    // let managers = [];

    connection.query("SELECT role.title, role.id FROM role", function (err, roleRes) {
        if (err) throw err;
        roles = roleRes;
        

        connection.query("SELECT department.name, department.id FROM department", function (err, managerRes) {
            if (err) throw err;
            managers = managerRes;
            

            inquirer
                .prompt([
                    {
                        name: "firstname",
                        type: "input",
                        message: "What is the employees first name?"
                    },
                    {
                        name: "lastname",
                        type: "input",
                        message: "What is the employees last name?"

                    },
                    {
                        name: "role",
                        type: "list",
                        message: "What is the employees role?",
                        choices: roles.map((role) => {
                            return {
                                name: role.title,
                                value: role.id
                            }
                        })
                    },
                    {
                        name: "manager",
                        type: "list",
                        message: "Who is the employees manager?",
                        choices: managers.map((manager) => {
                            return {
                                name: manager.title,
                                value: manager.id
                            }
                        })
                    }

                ]).then(function (answer) {

                    connection.query("INSERT INTO employee SET ?",
                        {
                            first_name: answer.firstname,
                            last_name: answer.lastname,
                            role_id: answer.role,
                            // manager_id: answer.manager
                        },
                        function (err, res) {
                            if (err) throw err;
                            console.log("new employee added")
                            runPrompt();

                        }
                    )
                })

        })
    })
}


function updateEmployeeRole() {
    let employees = []
    let roles = []

    connection.query("SELECT employee.first_name, employee.last_name, employee.id FROM employee", function (err, employeeRes) {
        if (err) throw err;
        employees = employeeRes;

        connection.query("SELECT role.title, role.id FROM role", function (err, roleRes) {
            if (err) throw err;
            roles = roleRes;

            inquirer
                .prompt([{
                    name: "employeeid",
                    type: "list",
                    message: "which employee would you like to update?",
                    choices: employees.map((employee) => {
                        return {
                            name: employee.first_name + " " + employee.last_name,
                            value: employee.id
                        }
                    })
                },
                {
                    name: "roleid",
                    type: "list",
                    message: "What is the new role you'd like to assign them to?",
                    choices: roles.map((role) => {
                        return {
                            name: role.title,
                            value: role.id
                        }
                    })
                }]).then(function (answer) {
                    connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [answer.roleid, answer.employeeid], function (err, res) {
                        if (err) throw err;
                        console.log("Updated Employee Role!");
                        runPrompt();
                    })
                })
        })
    })
}


// bonus views Employees by manager

// function byManager() {
//     connection.query("SELECT * FROM role", function (err, res) {
//         if (err) throw err;
//         console.table(res);
//     })
// };
