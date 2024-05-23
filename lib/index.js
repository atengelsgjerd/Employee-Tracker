const Inquirer = require("inquirer");

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
                    // viewAllEmployees();
                }
    
                else if (res.option === "Add Employee") {
                    console.log("Add Employee");
                    // addEmployee();
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
                    process.exit();
                    // console.log("Goodbye!");
                    // quit();
                }
            });
    }
    main();

viewAllEmployees = () => {
    console.log("View All Employees");
    main();
}
addEmployee = () => {
    console.log("Add Employee");
    main();
}
updateEmployeeRole = () => {
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