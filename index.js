const inquirer = require('inquirer');
const mysql = require('mysql2');
const { Console } = require('console');
const { Transform } = require('stream')


// create  connection
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '17250967',
  database: 'humanResources_db' 
});

function table(input) {
  // @see https://stackoverflow.com/a/67859384
  const ts = new Transform({ transform(chunk, enc, cb) { cb(null, chunk) } })
  const logger = new Console({ stdout: ts })
  logger.table(input)
  const table = (ts.read() || '').toString()
  let result = '';
  for (let row of table.split(/[\r\n]+/)) {
    let r = row.replace(/[^┬]*┬/, '┌');
    r = r.replace(/^├─*┼/, '├');
    r = r.replace(/│[^│]*/, '');
    r = r.replace(/^└─*┴/, '└');
    r = r.replace(/'/g, ' ');
    result += `${r}\n`;
  }
  console.log(result);
}



    // Initial prompt 
  initialPrompt()

    function initialPrompt() {
      inquirer.prompt([
      {
      type: "list",
      message: "What would you like to do?",
      name: "choice",
      choices: [
                "View All Employees", 
                "View All Departments",
                "View All Roles",
                "Add a Department?",
                "Add a Role",
                "Add an Employee",
                "Update an Employee's Role"   
              ]
      }
  ]).then(function(answer) {
    // switch (answer.choice) {
    //   case "View All Employees":
    //     viewEmployees();
    //     break;
    //   case "View All Departments":
    //     viewDepartments();
    //     break;
    //   case "View All Roles":
    //     viewRoles();
    //     break;
    //   case "Add a Department":
    //     addDepartment();
    //     break;
    //   case "Add a Role":
    //     addRole();
    //     break;
    //   case "Add an Employee":
    //     addEmployee();
    //     break;
    //   case "Update an Employee's Role":
    //     updateEmployeeRole();
    //     break;
    //   default:
    //     console.log("Invalid choice");
    // }
    if (answer.choice === "View All Employees") {
      viewEmployees();
    } else if (answer.choice === "View All Departments") {
      viewDepartments();
    } else if (answer.choice === "View All Roles") {
      viewRoles();
    } else if (answer.choice === "Add a Department") {
      addDepartment();
    } else if (answer.choice === "Add a Role") {
      addRole();
    } else if (answer.choice === "Add an Employee") {
      addEmployee();
    } else if (answer.choice === "Update an Employee's Role") {
      updateEmployeeRole();
    } else {
      console.log("Invalid choice");
    }
      })
  }

/// View employees

function viewEmployees() {
  console.clear()
  con.query("SELECT * from employee;", 
  function(err, res) {
    if (err) throw err
    table(res)
    initialPrompt()
})
}

/// View departments

function viewDepartments() {
  console.clear()
  con.query("SELECT * from department;", 
  function(err, res) {
    if (err) throw err
    table(res)
    initialPrompt()
})

}


/// View employees

function viewRoles() {
  console.clear()
  con.query("SELECT * from role_t;", 
  function(err, res) {
    if (err) throw err
    table(res)
    initialPrompt()
})
}
































// inquirer
//   .prompt([
//     {
//       type: 'input',
//       message: 'What is the name of the role?',
//       name: 'newRole',
//       validate: function (answer) {
//         if (answer.length < 2) {
//           return console.log("The name must has at least 3 characters");
//         }
//         return true;
//       }
//     },
//     {
//       type: 'number',
//       message: 'What is the salary of the role?',
//       name: 'salaryNewRole',
//     },
//     // {
//     //   type: 'list',
//     //   message: 'Which department does the role belong to?',
//     //   name: 'departmentBelong',
//     //   choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Role", "View All Departments", "Add Department", "Exit"],
//     //   validate: function (answer) {
//     //     if (answer.length === 0) {
//     //       return console.log("Select one!");
//     //     }
//     //     return true;
//     //   }
//     // },
//   ])


//   .then((response) => {

//   });






