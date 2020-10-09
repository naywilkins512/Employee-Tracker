const mysql = require("mysql");
const inquirer = require("inquirer");

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
    connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err;

        console.log(res)
    } )
};

// views Employees by department

function byDepartment() {
    connection.query("SELECT department FROM team", function(err, res) {
        if (err) throw err;

        console.log(res)
    } )
};

// views Employees by manager

function byManager() {
    connection.query("SELECT * FROM team WHERE manager", function(err, res){
        if (err) throw err;
        console.log(res)
    })
};

