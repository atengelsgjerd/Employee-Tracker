const Inquirer = require("inquirer");
const connections = require('./lib/connection');


//Welcome message
console.log("");
console.log(" ==========================");
console.log("║ EMPLOYEE MANAGEMENT SYSTEM ║");
console.log(" ==========================");
console.log("");

function main() {
    Inquirer.prompt([
        {
            type: "list",
            loop: false,
            message: "What would you like to do?",
            name: "option",
            choices: ["View All Employees",
                "Add Employee",
                "Update Employee Role",
                "View All Roles",
                "Add Role",
                "View All Departments",
                "Add Department",
                "Quit"]
            }
        ])
            .then((res) => {
                if (res.option === "View All Employees") {
                    console.log("View All Employees");
                     viewAllEmployees();
                }
    
                else if (res.option === "Add Employee") {
                    console.log("Add Employee");
                     addEmployee();
                }
                else if (res.option === "Update Employee Role") {
                    console.log("Update Employee Role");
                    // updateEmployeeRole();
                }
                else if (res.option === "View All Roles") {
                    console.log("View All Roles");
                    // viewAllRoles();
                }
                else if (res.option === "Add Role") {
                    console.log("Add Role");
                    // addRole();
                }
                else if (res.option === "View All Departments") {
                    console.log("View All Departments");
                    // viewAllDepartments();
                }
                else if (res.option === "Add Department") {
                    console.log("Add Department");
                    // addDepartment();
                }
                else if (res.option === "Quit") {
                    console.log("Goodbye!");
                    process.exit();
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
main();

let response;
viewAllEmployees = async () => {
    console.log("");
    try {
    console.log("View All Employees");
    client = await connections;
    response = await client.query(`SELECT e.id as employee_id,
    e.first_name || ' ' || e.last_name as employee,
    m.first_name || ' ' || m.last_name as manager,
    role.title as job_title,
    department.department_name as Department,
    role.salary from EMPLOYEE e
    JOIN role ON e.role_id = role.id
    JOIN department ON role.department_id = department.id
    inner JOIN employee m ON m.id = e.manager_id
    ORDER BY department_id ASC`)
    console.log('');
    console.table(response.rows);
    }
    catch (err) {
        console.log(err);
    }
    main();
}

addEmployee = async () => {
    try{
        console.log("");
        console.log("Add Employee");
        console.log('');

        let client = await connections;

        const roles = await client.query("SELECT * FROM role");

        const managers = await client.query(`SELECT e.first_name || ' ' || e.last_name as Employee_name,
        role.title,
        e.id as manager_id
        FROM EMPLOYEE e
        JOIN role ON e.role_id = role.id
        WHERE role.title LIKE '%anager%' or role.title LIKE '%ead%'`);

        const roleChoices = roles.rows.map(role => ({ name: role.title, value: role.id}))

        const managerChoices = managers.rows.map(manager => ({ name: (manager.employee_name + " --- " + manager.title), value: manager.manager_id}))

        const answers = await Inquirer.prompt([
            {
                type: "input",
                message: "Enter Employee's First Name",
                name: "first_name"
            },
            {
                type: "input",
                message: "Enter Employee's Last Name",
                name: "last_name"
            },
            {
                type: "list",
                loop: false,
                message: "Select Employee's Role",
                name: "role_id",
                choices: roleChoices
            },
            {
                type: "list",
                loop: false,
                message: "Select Employee's Manager",
                name: "manager_id",
                choices: managerChoices
            }
        ]);

        console.log(answers);

        client = await connections;
        response = await client.query(`INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id) VALUES ('${answers.first_name}', '${answers.last_name}', ${answers.role_id}, ${answers.manager_id})`);
        console.log('');
        console.table(response.rows);
        console.log('');
        response = await client.query('SELECT * FROM employee')
        console.table(response.rows);
    }
    catch(err){
        console.log(err);
    }
    main();
}
updateEmployeeRole = async () => {
    try {
        console.log("Update Employee Role");
        console.log('');

        let client = await connections;

        const employees = await client.query("SELECT * FROM employee");

        const roles = await client.query("SELECT * FROM role");

        const roleChoices = roles.rows.map(role => ({ name: "Role Title: " = role.title + " --- " + "Role ID: " + role.id, value: role.id}));
        const employeeChoices = employees.rows.map(employee => ({ name: "Employee Name: " + employee.first_name + " " + employee.last_name + " --- " + "Current Role: " + employee.role_id, value: employee.id}));
        
    }
    console.log("Update Employee Role");
    main();
}
viewAllRoles = () => {
    console.log("View All Roles");
    main();
}
addRole = () => {
    console.log("Add Role");
    main();
}
viewAllDepartments = () => {
    console.log("View All Departments");
    main();
}
addDepartment = () => {
    console.log("Add Department");
    main();
}
quit = () => {
    console.log("Goodbye!");
    // process.exit();
}