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
    console.log("connected as id " + connection.threadId + "\n");
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
                "View All Employees By Department",
                "View All Employees By Manager",
                "Add An Employee",
                "Remove An Employee",
                "Add A Department",
                "Update Employee Role",
                "Update Employee Manager",
                "View All Roles"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View All Employees":
                    viewEmployees()
                    break;
                case "View All Employees By Department":
                    byDepartment()
                    break;
                case "View All Employees By Manager":
                    byManager()
                    break;
                case "Add An Employee":
                    addEmployee()
                    break;
                case "Remove An Employee":
                    removeEmployee()
                    break;
                case "Add A Department":
                    addDepartment()
                    break;
                case "Update Employee Role":
                    updateEmployeeRole()
                    break;
                case "Update Employee Manager":
                    updateManager()
                    break;
                case "View All Roles":
                    viewAllRoles();
                    break;
                case "exit":
                    connection.end()
                    break;
            }
        })
}

//views all employees

function viewEmployees() {
    connection.query("SELECT * FROM employee, department, role", function (err, res) {
        if (err) throw err;

        console.table(res);
        runPrompt();
    })
};

// views Employees by department


function byDepartment() {

    inquirer
        .prompt({
            name: "department",
            type: "list",
            message: "what department would you like to see?",
            choices: [
                "Sales",
                "Front-End",
                "Back-End",
                "Management"

            ]

        }).then(function (answer) {

            connection.query("SELECT * FROM department WHERE name = ?", answer.department, function (err, res) {
                if (err) throw err;

                console.table(res);
            })

        });


};

// bonus views Employees by manager

function byManager() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.table(res);
    })
};


// add employee

function addEmployee() {

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
                type: "input",
                message: "What is the employees role id?"
            },
            {
                name: "manager",
                type: "input",
                message: "What is the employees manager id?"
            }

        ]).then(function (answer) {

            connection.query("INSERT INTO employee SET ?",
                {
                    first_name: answer.firstname,
                    last_name: answer.lastname,
                    role_id: answer.role,
                    manager_id: answer.manager
                },
                function (err, res) {
                    if (err) throw err;
                    console.log("new employee added" + "\n" + JSON.stringify(res))

                }
            )
        })
        
}


