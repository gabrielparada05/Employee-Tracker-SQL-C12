const inquirer = require('inquirer');
const mysql = require('mysql2');
const { Console } = require('console');
const { Transform } = require('stream');
const { map } = require('rxjs');


// create  connection
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '17250967',
  database: 'humanResources_db' 
});


 

function principalLogo() {
  console.log (`
  ███████ ███    ███ ██████  ██       ██████  ██    ██ ███████ ███████ 
  ██      ████  ████ ██   ██ ██      ██    ██  ██  ██  ██      ██      
  █████   ██ ████ ██ ██████  ██      ██    ██   ████   █████   █████   
  ██      ██  ██  ██ ██      ██      ██    ██    ██    ██      ██      
  ███████ ██      ██ ██      ███████  ██████     ██    ███████ ███████ 
                                                                       
                                                                       
      ████████ ██████   █████   ██████ ██   ██ ███████ ██████          
         ██    ██   ██ ██   ██ ██      ██  ██  ██      ██   ██         
         ██    ██████  ███████ ██      █████   █████   ██████          
         ██    ██   ██ ██   ██ ██      ██  ██  ██      ██   ██         
         ██    ██   ██ ██   ██  ██████ ██   ██ ███████ ██   ██         
                                                                       
                                                                        `)
}

principalLogo()

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
                "Add a Department",
                "Add a Role",
                "Add an Employee",
                "Update an Employee's Role"   
              ],
    validate: function (answer) {
                if (answer.length === 0) {
                  return console.log("Select one!");
                }
                return true;
        
              }
        
      }
  ]).then(function(answer) {

    const lookupChoice = {
      "View All Employees": () => viewEmployees(),
      "View All Departments": () => viewDepartments(),
      "View All Roles": () => viewRoles(),
      "Add a Department": () => addDepartment(),
      "Add a Role": () => addRole(),
      "Add an Employee": () => addEmployee(),
      "Update an Employee's Role": () => updateEmployeeRole()
    }
  
    const fn = lookupChoice[answer.choice]
    fn()

    // if (answer.choice === "View All Employees") {
    //   viewEmployees();
    // } else if (answer.choice === "View All Departments") {
    //   viewDepartments();
    // } else if (answer.choice === "View All Roles") {
    //   viewRoles();
    // } else if (answer.choice === "Add a Department") {
    //   addDepartment();
    // } else if (answer.choice === "Add a Role") {
    //   addRole();
    // } else if (answer.choice === "Add an Employee") {
    //   addEmployee();
    // } else if (answer.choice === "Update an Employee's Role") {
    //   updateEmployeeRole();
    // } else {
    //   console.log("Invalid choice");
    // }
      })
  }

/// View employees

function viewEmployees() {
  console.clear()
  principalLogo()
  console.log(`
              ╔═╗╔╦╗╔═╗╦  ╔═╗╦ ╦╔═╗╔═╗╔═╗
              ║╣ ║║║╠═╝║  ║ ║╚╦╝║╣ ║╣ ╚═╗
              ╚═╝╩ ╩╩  ╩═╝╚═╝ ╩ ╚═╝╚═╝╚═╝
  `)
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
  principalLogo()
  console.log(`
╔╦╗╔═╗╔═╗╔═╗╦═╗╔╦╗╔╦╗╔═╗╔╗╔╔╦╗╔═╗
 ║║║╣ ╠═╝╠═╣╠╦╝ ║ ║║║║╣ ║║║ ║ ╚═╗
═╩╝╚═╝╩  ╩ ╩╩╚═ ╩ ╩ ╩╚═╝╝╚╝ ╩ ╚═╝
  `)
  con.query("SELECT * from department;", 
  function(err, res) {
    if (err) throw err
    table(res)
    initialPrompt()
})

}


/// View roles

function viewRoles() {
  console.clear()
  principalLogo()
  console.log (`
                  ╦═╗╔═╗╦  ╔═╗╔═╗
                  ╠╦╝║ ║║  ║╣ ╚═╗
                  ╩╚═╚═╝╩═╝╚═╝╚═╝
`)
  con.query("SELECT * from role_t;", 
  function(err, res) {
    if (err) throw err
    table(res)
    initialPrompt()
})
}

/// Add DEPARTMENT

function addDepartment() {
  console.clear()
  principalLogo()

  con.query("SELECT DISTINCT department.*, role_t.* FROM role_t cross JOIN department ORDER BY id_dep ASC;", 
function(err, res1) {
  if (err) throw err
  const nameDep = [...new Set(res1.map(x => x.id_role))];
  //calvin s
  console.log(`
      ╔╦╗╔═╗╔═╗╔═╗╦═╗╔╦╗╔═╗╔╗╔╔╦╗╔═╗  ╔═╗╔╗╔╔╦╗  ╦═╗╔═╗╦  ╔═╗╔═╗
       ║║║╣ ╠═╝╠═╣╠╦╝║║║║╣ ║║║ ║ ╚═╗  ╠═╣║║║ ║║  ╠╦╝║ ║║  ║╣ ╚═╗
      ═╩╝╚═╝╩  ╩ ╩╩╚═╩ ╩╚═╝╝╚╝ ╩ ╚═╝  ╩ ╩╝╚╝═╩╝  ╩╚═╚═╝╩═╝╚═╝╚═╝
      `)
  table(res1)
 


  inquirer.prompt([
  {
    type: 'input',
    message: 'What is the name of the new department?',
    name: 'newDep',
    validate: function (answer) {
      if (answer.length === 0) {
        return console.log("Write one!");
      }
      return true;
    },
  },
]).then(function(answer) {
  con.query(`INSERT INTO department (name_dep) VALUES ("${answer.newDept}");`, 
  function(err, res) {
    if (err) throw err
    initialPrompt()
}) })
})}


/// Add role

function addRole() {
  console.clear()
  principalLogo()

  con.query("SELECT DISTINCT employee.*, role_t.* FROM employee JOIN role_t ON employee.role_id = role_t.id_role ORDER BY id_emp ASC;", 
function(err, res1) {
  if (err) throw err
  const nameDep = [...new Set(res1.map(x => x.id_role))];
  console.log(`
                          ╔═╗╔╦╗╔═╗╦  ╔═╗╦ ╦╔═╗╔═╗  ╔═╗╔╗╔╔╦╗  ╦═╗╔═╗╦  ╔═╗╔═╗
                          ║╣ ║║║╠═╝║  ║ ║╚╦╝║╣ ╚═╗  ╠═╣║║║ ║║  ╠╦╝║ ║║  ║╣ ╚═╗
                          ╚═╝╩ ╩╩  ╩═╝╚═╝ ╩ ╚═╝╚═╝  ╩ ╩╝╚╝═╩╝  ╩╚═╚═╝╩═╝╚═╝╚═╝ 
                          `)
  table(res1)
 


  inquirer.prompt([
  {
    type: 'input',
    message: 'Indicate the new role',
    name: 'newRole',
    validate: function (answer) {
      if (answer.length === 0) {
        return console.log("Write one!");
      }
      return true;
    },
  },
  {
    type: 'number',
    message: 'Indicate the salary for the new role',
    name: 'newSalary',
    validate: function (answer) {
      if (answer.length === 0) {
        return console.log("Write one!");
      }
      return true;
    },
  },
  {
    type: 'list',
    message: 'Select the ID department for new role',
    name: 'deptRole',
    choices: nameDep
  },
  
]).then(function(answer) {
  con.query(`INSERT INTO role_t (title, salary, department_id) VALUES ("${answer.newRole}", ${answer.newSalary},${answer.deptRole});`, 
  function(err, res) {
    if (err) throw err
    initialPrompt()
}) })
})}



/// Add employee

function addEmployee() {
  console.clear()
  principalLogo()
  con.query("SELECT DISTINCT employee.*, role_t.* FROM employee JOIN role_t ON employee.role_id = role_t.id_role;", 
function(err, res1) {
  if (err) throw err
  const nameDep = [...new Set(res1.map(x => x.id_role))];
  console.log(`

                                          ╔═╗╔╦╗╔═╗╦  ╔═╗╦ ╦╔═╗╔═╗╔═╗
                                          ║╣ ║║║╠═╝║  ║ ║╚╦╝║╣ ║╣ ╚═╗
                                          ╚═╝╩ ╩╩  ╩═╝╚═╝ ╩ ╚═╝╚═╝╚═╝
                                          
                                        `)
  table(res1)
 
  inquirer.prompt([
  {
    type: 'input',
    message: 'What is the new employee`s first name?',
    name: 'newFirstName',
    validate: function (answer) {
      if (answer.length === 0) {
        return console.log("Write one!");
      }
      return true;
    },
  },
  {
    type: 'input',
    message: 'What is the new employee`s last name?',
    name: 'newLastName',
    validate: function (answer) {
      if (answer.length === 0) {
        return console.log("Write one!");
      }
      return true;
    },
  },
  {
    type: 'list',
    message: 'What is the new employee`s role?',
    name: 'role',
    choices: nameDep,
  },
  {
    type: 'numeric',
    message: 'What is the new employee`s manager ID? If you do not know the manager ID, press 1',
    name: 'manager',
  },
]).then(function(answer) {
  con.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answer.newFirstName}","${answer.newLastName}",${answer.role}, ${answer.manager});`, 
  function(err, res) {
    if (err) throw err
    initialPrompt()
}) })
})}


// function addDepartment() {
//   console.clear()
//   principalLogo()
//   inquirer.prompt([
//   {
//     type: 'input',
//     message: 'Indicate the new department`s name',
//     name: 'newDep',
//     validate: function (answer) {
//       if (answer.length === 0) {
//         return console.log("Write one!");
//       }
//       return true;
//     }
//   },
// ]).then(function(answer) {
//   con.query(`INSERT INTO department (name_dep) VALUES ("${answer.newDep}");`, 
//   function(err, res) {
//     if (err) throw err
//     table(res)
//     initialPrompt()
// })
// })}






























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






