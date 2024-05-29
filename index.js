const inquirer = require("inquirer");
const connections = require('./lib/connection');


//Welcome message
console.log("");
console.log(" ==========================");
console.log("║ EMPLOYEE MANAGEMENT SYSTEM ║");
console.log(" ==========================");
console.log("");

async function main() {
    try {
        const res = await inquirer.prompt([
            {
                type: "list",
                loop: false,
                message: "What would you like to do?",
                name: "option",
                choices: [
                    "View All Employees",
                    "Add Employee",
                    "Update Employee Role",
                    "View All Roles",
                    "Add Role",
                    "View All Departments",
                    "Add Department",
                    "Quit"
                ]
            }
        ]);

        if (res.option === "View All Employees") {
            await viewAllEmployees();
        } else if (res.option === "Add Employee") {
            await addEmployee();
        } else if (res.option === "Update Employee Role") {
            updateEmployeeRole();
        } else if (res.option === "View All Roles") {
            viewAllRoles();
        } else if (res.option === "Add Role") {
            addRole();
        } else if (res.option === "View All Departments") {
            viewAllDepartments();
        } else if (res.option === "Add Department") {
            addDepartment();
        } else if (res.option === "Quit") {
            process.exit();
        }
    } catch (err) {
        console.log("Error: ", err.message);
    }
}
main();
let response;
viewAllEmployees = async () => {
    console.log("");
    try {
    console.log("View All Employees");
    client = await connections;
    response = await client.query(`SELECT e.id as employee_id,
    e.first_name || ' ' || e.last_name AS employee,
    m.first_name || ' ' || m.last_name AS manager,
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

        const answers = await inquirer.prompt([
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

        let client = await connections

        const employees = await client.query("SELECT * FROM employee")

        const roles = await client.query("SELECT * FROM role")

        const roleChoices = roles.rows.map(role => ({ name: "Role Title: " + role.title + " --- " + "Role ID: " + role.id, value: role.id}));
        const employeeChoices = employees.rows.map(employee => ({ name: "Employee Name: " + employee.first_name + " " + employee.last_name + " --- " + "Current Role: " + employee.role_id, value: employee.id}));


        const answers = await inquirer.prompt([
            {
                type: "list",
                loop: false,
                message: "Select Employee to Update",
                name: "employee.id",
                choices: employeeChoices
            },
            {
                type: "list",
                loop: false,
                message: "Select New Role",
                name: "role.id",
                choices: roleChoices
            }
        ]);

        response = await client.query(`UPDATE employee SET role_id = ${answers.role.id} WHERE id = ${answers.employee.id}`);

        console.log('');
        console.table(response.rows);
        console.log('');
        response = await client.query('SELECT * FROM employee');
        console.table(response.rows);
    }
    catch(err){
        console.log(err);
    }
    main();
}
viewAllRoles = async () => {
    try {
        console.log("View All Roles");
        client = await connections;
        response = await client.query("SELECT * FROM role");
        console.log('');
        console.table(response.rows);
    }
    catch(err){
        console.log(err);
    }
    main();
}
addRole = async () => {
    try {
        console.log("");
        console.log("Add Role");
        console.log('');
        console.info("MESSAGE: In order to add a new role, first select the department to which the role belongs.");
        console.log("If department does not exist, please add department first.");
        console.log('');
        console.log("Current roles within the database: ");
        console.log('');

        let client = await connections;

        const roles = await client.query("SELECT * FROM role");
        console.table(roles.rows);
        console.log('');

        const departments = await client.query("SELECT * FROM department");
        const departmentChoices = departments.rows.map(department => ({ name: department.department_name, value: department.id}));
        console.log("Current departments within the database: ");
        console.log('');
        console.table(departments.rows);
        console.log('');

        const answers = await inquirer.prompt([
            {
                type: "list",
                loop: false,
                message: "Enter the name of the department to which the role belongs: ",
                name: "department_id",
                choices: departmentChoices
            },
            {
                type: "input",
                message: "Enter a title for the new role: ",
                name: "title",
                validate: function (title) {
                    if (!title || title.trim().length === 0 || !/^[a-zA-Z\s]+$/.test(title)) {
                        console.log("\n Please enter a valid title for the role.");
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            {
                type: "input",
                message: "Enter the salary for the new role: ",
                name: "salary",
                validate: function (salary) {

                    let pay = parseFloat(salary);
                    const notValid = isNaN(pay);

                    const validUpperLimit = 1000000.00;
                    const validLowerLimit = 10000.00;
                    if (Salary = notValid || salary < validLowerLimit || salary > validUpperLimit) {
                        console.log("\n Please enter a valid salary for the role.");
                        return false;
                    } else {
                        console.log("Salary: ", salary);
                        return true;
                    }
                }
            },
        ]);

        const title = answers.title.toLowerCase();
        const firstLetter = title.charAt(0)
        const firstLetterCap = firstLetter.toUpperCase();
        const remainingLetters = title.slice(1);
        const capitalizedWord = firstLetterCap + remainingLetters;
        console.log("\n Title: ", capitalizedWord);

        console.log(answers);

        client = await connections;

        response = await client.query(`INSERT INTO role (department_id, title, salary) VALUES (${answers.department_id}, '${capitalizedWord}', ${answers.salary})`);
    }
    catch(err){
        console.log(err);
    }
    main();
};
viewAllDepartments = async () => {
    try {
        console.log("");
        console.log("View All Departments");
        client = await connections;
        response = await client.query("SELECT id, department_name FROM department");
        console.log('');
        console.table(response.rows);
    }
    catch(err){
        console.log(err);
    }
    main();
};
addDepartment = async () => {
    try {
        console.log("");
        console.log("Add Department");
        console.log('');

        console.log("Current departments within the database: ");
        console.log('');

        let client = await connections;

        const currentDepartments = await client.query("SELECT * FROM department");
        console.table(currentDepartments.rows);
        console.log('');

        const answers = await inquirer.prompt([
            {
                type: "input",
                message: "Enter the name of the new department: ",
                name: "department_name",
                validate: function (department_name) {
                if (!department_name || department_name === '""' || department_name === "" || department_name === " " || department_name === null || department_name === undefined || department_name === "null" || department_name === "undefined" || department_name === ")") {
                    console.log("\n Please enter a valid department:");
                    return false;
                }
                else {
                    return true;
                
                }
            },
        }
    ]);

    const department_name = answers.department_name.toLowerCase();
    const firstLetter = department_name.charAt(0);
    const firstLetterCap = firstLetter.toUpperCase();
    const remainingLetters = department_name.slice(1);
    const capitalizedWord = firstLetterCap + remainingLetters;
    console.log("\n Department Name: ", capitalizedWord);
    console.log(answers);

    client = await connections;

    response = await client.query(`INSERT INTO department (department_name) VALUES ('${answers.department_name}')`);
    }
    catch(err){
        console.log(err);
    }
    main();
};
quit = () => {
    console.log("Goodbye!");
     process.exit();
}