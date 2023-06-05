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
                "View employees by manager",
                "View employees by department",
                "Add a Department",
                "Add a Role",
                "Add an Employee",
                "Update an Employee's Role", 
                "Update employee`s Manager"
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
      "View employees by manager": () => viewManagers(),
      // "View employees by department": () => viewEmployDepart(),
      // Delete departments, roles, and employees
      // View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.
      "Add a Department": () => addDepartment(),
      "Add a Role": () => addRole(),
      "Add an Employee": () => addEmployee(),
      "Update an Employee's Role": () => updateEmployeeRole(),
      "Update employee`s Manager": () => updateEmployeeManager()
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


/// View employees by manager

function viewManagers() {
  console.clear()
  principalLogo()
  con.query("SELECT DISTINCT employee.*, role_t.* FROM employee JOIN role_t ON employee.role_id = role_t.id_role;", 
  function(err, res) {
    if (err) throw err
    console.log (`
    ╔═╗╔╦╗╔═╗╦  ╔═╗╦ ╦╔═╗╔═╗╔═╗  ╔═╗╔╗╔╔╦╗  ╔╦╗╔═╗╔╗╔╔═╗╔═╗╔═╗╦═╗╔═╗
    ║╣ ║║║╠═╝║  ║ ║╚╦╝║╣ ║╣ ╚═╗  ╠═╣║║║ ║║  ║║║╠═╣║║║╠═╣║ ╦║╣ ╠╦╝╚═╗
    ╚═╝╩ ╩╩  ╩═╝╚═╝ ╩ ╚═╝╚═╝╚═╝  ╩ ╩╝╚╝═╩╝  ╩ ╩╩ ╩╝╚╝╩ ╩╚═╝╚═╝╩╚═╚═╝
`)
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
  con.query(`INSERT INTO role_t (title, salary, dept_id) VALUES ("${answer.newRole}", ${answer.newSalary},${answer.deptRole});`, 
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
    message: 'What is the employee`s first name?',
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
    message: 'What is the employee`s last name?',
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
    message: 'What is the employee`s role?',
    name: 'role',
    choices: nameDep,
  },
  {
    type: 'numeric',
    message: 'What is the employee`s manager ID? If you do not know the manager ID, type null',
    name: 'manager',
  },
]).then(function(answer) {
  con.query(`INSERT INTO employee (f_name, l_name, role_id, man_id) VALUES ("${answer.newFirstName}","${answer.newLastName}",${answer.role}, ${answer.manager});`, 
  function(err, res) {
    if (err) throw err
    initialPrompt()
}) })
})}


/// Update employee

function updateEmployeeRole() {
  console.clear()
  principalLogo()
  con.query("SELECT DISTINCT employee.*, role_t.* FROM employee JOIN role_t ON employee.role_id = role_t.id_role;", 
function(err, res1) {
  if (err) throw err
  const roles = [...new Set(res1.map(x => x.id_role))];
  const employees = [...new Set(res1.map(x => x.id_emp))]
  console.log(`

                                          ╔═╗╔╦╗╔═╗╦  ╔═╗╦ ╦╔═╗╔═╗╔═╗
                                          ║╣ ║║║╠═╝║  ║ ║╚╦╝║╣ ║╣ ╚═╗
                                          ╚═╝╩ ╩╩  ╩═╝╚═╝ ╩ ╚═╝╚═╝╚═╝
                                          
                                        `)
  table(res1)
 
  inquirer.prompt([
    {
      type: 'list',
      message: 'Select an employee ID to update their role?',
      name: 'employeeID',
      choices: employees,
    },
  {
    type: 'list',
    message: 'What is the new employee`s role?',
    name: 'roleId',
    choices: roles,
  },
]).then(function(answer) {
  con.query(`UPDATE employee SET role_id = ${answer.roleId} where id_emp = ${answer.employeeID}; `, 
  function(err, res) {
    if (err) throw err
    initialPrompt()
}) })
})}


/// Update employee`s manager

function updateEmployeeManager() {
  console.clear()
  principalLogo()
  con.query("SELECT manager.id_man, manager.f_name AS manager_first_name, manager.l_name AS manager_last_name, employee.id_emp, employee.f_name AS employee_first_name, employee.l_name AS employee_last_name, employee.man_id FROM manager LEFT JOIN employee ON employee.man_id = manager.id_man ORDER BY manager.id_man ASC;", 
function(err, res2) {
  
  if (err) throw err
  const manager = [...new Set(res2.map(x => x.id_man))];
  const employees = [];
for (let i = 0; i < res2.length; i++) {
  const id_emp = res2[i].id_emp;
  if (id_emp !== null) {
    employees.push(id_emp);
  }
}


  console.log(`

              ╔═╗╔╦╗╔═╗╦  ╔═╗╦ ╦╔═╗╔═╗╔═╗  ╔═╗╔╗╔╔╦╗  ╔╦╗╔═╗╔╗╔╔═╗╔═╗╔═╗╦═╗╔═╗
              ║╣ ║║║╠═╝║  ║ ║╚╦╝║╣ ║╣ ╚═╗  ╠═╣║║║ ║║  ║║║╠═╣║║║╠═╣║ ╦║╣ ╠╦╝╚═╗
              ╚═╝╩ ╩╩  ╩═╝╚═╝ ╩ ╚═╝╚═╝╚═╝  ╩ ╩╝╚╝═╩╝  ╩ ╩╩ ╩╝╚╝╩ ╩╚═╝╚═╝╩╚═╚═╝
                                          
                                        `)
  table(res2)
 
  inquirer.prompt([
    {
      type: 'list',
      message: 'Select an employee ID to update their manager?',
      name: 'employeeID',
      choices: employees,
    },
  {
    type: 'list',
    message: 'What is the new employee`s manager?',
    name: 'managerId',
    choices: manager,
  },
]).then(function(answer) {
  con.query(`UPDATE employee SET man_id = ${answer.managerId} where id_emp = ${answer.employeeID}; `, 
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






