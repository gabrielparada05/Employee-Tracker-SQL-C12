const inquirer = require('inquirer');
const mysql = require('mysql2');
const { Console } = require('console');
const { Transform } = require('stream');
const { map } = require('rxjs');
require('dotenv').config();


// create  connection
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.password,
  database: 'humanResources_db' 
});

// https://www.javascripttutorial.net/array/javascript-remove-duplicates-from-array/
// https://www.geeksforgeeks.org/how-to-remove-duplicate-elements-from-javascript-array/
 

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
                "View annual budget by department",
                "Add a Department",
                "Add a Role",
                "Add an Employee",
                "Update an Employee's Role", 
                "Update employee`s Manager", 
                "Delete departments, roles, and employees"
              ],
    validate: function (answer) {
                if (answer.length === 0) {
                  return console.log("Select one!");
                }
                return true;
        
              }
        
      }
  ]).then(function(answer) {

    const userChoice = answer.choice;

    if (userChoice === "View All Employees") {
      viewEmployees();
    } else if (userChoice === "View All Departments") {
      viewDepartments();
    } else if (userChoice === "View All Roles") {
      viewRoles();
    } else if (userChoice === "View employees by manager") {
      viewManagers();
    } else if (userChoice === "View employees by department") {
      viewEmployDepart();
    } else if (userChoice === "View annual budget by department") {
      viewAnnualBudget();
    } else if (userChoice === "Add a Department") {
      addDepartment();
    } else if (userChoice === "Add a Role") {
      addRole();
    } else if (userChoice === "Add an Employee") {
      addEmployee();
    } else if (userChoice === "Update an Employee's Role") {
      updateEmployeeRole();
    } else if (userChoice === "Update employee`s Manager") {
      updateEmployeeManager();
    } else if (userChoice === "Delete departments, roles, and employees") {
      deleteElements();
    } else {
      console.log("Invalid choice. Please try again.")
    }
    



    // const lookupChoice = {
    //   "View All Employees": () => viewEmployees(),
    //   "View All Departments": () => viewDepartments(),
    //   "View All Roles": () => viewRoles(),
    //   "View employees by manager": () => viewManagers(),
    //   "View employees by department": () => viewEmployDepart(),
    //   "View annual budget by department": () => viewAnnualBudget(),
    //   "Add a Department": () => addDepartment(),
    //   "Add a Role": () => addRole(),
    //   "Add an Employee": () => addEmployee(),
    //   "Update an Employee's Role": () => updateEmployeeRole(),
    //   "Update employee`s Manager": () => updateEmployeeManager(),
    //   "Delete departments, roles, and employees" : () => deleteElements()
    // }
  
    // const fn = lookupChoice[answer.choice]
    // fn()

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
  con.query('SELECT id_emp AS ID_Emp, first_name AS First_Name, last_name AS Last_Name, role_id AS Role, man_id AS Manager_ID from employee;', 
  function(err, res) {
    if (err) throw err
    console.clear()
    principalLogo()
    console.log(`
              ╔═╗╔╦╗╔═╗╦  ╔═╗╦ ╦╔═╗╔═╗╔═╗
              ║╣ ║║║╠═╝║  ║ ║╚╦╝║╣ ║╣ ╚═╗
              ╚═╝╩ ╩╩  ╩═╝╚═╝ ╩ ╚═╝╚═╝╚═╝
  `)
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
  con.query("SELECT id_dep AS 'ID Department', name_dep AS 'Department' from department;", 
  function(err, res) {
    if (err) throw err
    console.clear()
    principalLogo()
     console.log(`
╔╦╗╔═╗╔═╗╔═╗╦═╗╔╦╗╔╦╗╔═╗╔╗╔╔╦╗╔═╗
 ║║║╣ ╠═╝╠═╣╠╦╝ ║ ║║║║╣ ║║║ ║ ╚═╗
═╩╝╚═╝╩  ╩ ╩╩╚═ ╩ ╩ ╩╚═╝╝╚╝ ╩ ╚═╝
  `)
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
  con.query("SELECT id_role AS 'ID Role', title AS 'Title', salary AS 'Annual Salary', dept_id AS 'Department ID' FROM role_t;", 
  function(err, res) {
    if (err) throw err
    console.clear()
    principalLogo()
    console.log (`
                  ╦═╗╔═╗╦  ╔═╗╔═╗
                  ╠╦╝║ ║║  ║╣ ╚═╗
                  ╩╚═╚═╝╩═╝╚═╝╚═╝
`)
    table(res)
    initialPrompt()
})
}


/// View employees by manager

function viewEmployDepart() {
  console.clear()
  principalLogo()
  con.query("SELECT e.id_emp AS 'ID Emp', e.first_name AS 'First Name - Emp', e.last_name AS 'Last Name - Emp', r.dept_id AS 'ID Dep' , name_dep AS 'Department' FROM employee AS e JOIN role_t AS r ON e.role_id = r.id_role JOIN department AS d ON r.dept_id = id_dep;", 
  function(err, res) {
    if (err) throw err
    console.log (`
      ╔═╗╔╦╗╔═╗╦  ╔═╗╦ ╦╔═╗╔═╗╔═╗  ╔╗ ╦ ╦  ╔╦╗╔═╗╔═╗╔═╗╦═╗╔╦╗╔╦╗╔═╗╔╗╔╔╦╗
      ║╣ ║║║╠═╝║  ║ ║╚╦╝║╣ ║╣ ╚═╗  ╠╩╗╚╦╝   ║║║╣ ╠═╝╠═╣╠╦╝ ║ ║║║║╣ ║║║ ║ 
      ╚═╝╩ ╩╩  ╩═╝╚═╝ ╩ ╚═╝╚═╝╚═╝  ╚═╝ ╩   ═╩╝╚═╝╩  ╩ ╩╩╚═ ╩ ╩ ╩╚═╝╝╚╝ ╩ 
`)
    console.clear()
    principalLogo()
    console.log (`
      ╔═╗╔╦╗╔═╗╦  ╔═╗╦ ╦╔═╗╔═╗╔═╗  ╔╗ ╦ ╦  ╔╦╗╔═╗╔═╗╔═╗╦═╗╔╦╗╔╦╗╔═╗╔╗╔╔╦╗
      ║╣ ║║║╠═╝║  ║ ║╚╦╝║╣ ║╣ ╚═╗  ╠╩╗╚╦╝   ║║║╣ ╠═╝╠═╣╠╦╝ ║ ║║║║╣ ║║║ ║ 
      ╚═╝╩ ╩╩  ╩═╝╚═╝ ╩ ╚═╝╚═╝╚═╝  ╚═╝ ╩   ═╩╝╚═╝╩  ╩ ╩╩╚═ ╩ ╩ ╩╚═╝╝╚╝ ╩ 
`)
    table(res)
    initialPrompt()
})
}


/// View employees by department

function viewManagers() {
  console.clear()
  principalLogo()
  con.query("SELECT em.id_emp as 'Id Emp', em.first_name as 'First Name - Emp', em.last_name AS 'Last Name - Emp', man_id AS 'ID Manager', man.first_name AS 'First Name - Manager', man.last_name AS 'Last Name - Manager' FROM employee as em JOIN manager as man ON em.man_id = man.id_man order by id_emp ASC;", 
  function(err, res) {
    if (err) throw err
    console.log (`
    ╔═╗╔╦╗╔═╗╦  ╔═╗╦ ╦╔═╗╔═╗╔═╗  ╔═╗╔╗╔╔╦╗  ╔╦╗╔═╗╔╗╔╔═╗╔═╗╔═╗╦═╗╔═╗
    ║╣ ║║║╠═╝║  ║ ║╚╦╝║╣ ║╣ ╚═╗  ╠═╣║║║ ║║  ║║║╠═╣║║║╠═╣║ ╦║╣ ╠╦╝╚═╗
    ╚═╝╩ ╩╩  ╩═╝╚═╝ ╩ ╚═╝╚═╝╚═╝  ╩ ╩╝╚╝═╩╝  ╩ ╩╩ ╩╝╚╝╩ ╩╚═╝╚═╝╩╚═╚═╝
`)
    console.clear()
    principalLogo()
    console.log (`
    ╔═╗╔╦╗╔═╗╦  ╔═╗╦ ╦╔═╗╔═╗╔═╗  ╔═╗╔╗╔╔╦╗  ╔╦╗╔═╗╔╗╔╔═╗╔═╗╔═╗╦═╗╔═╗
    ║╣ ║║║╠═╝║  ║ ║╚╦╝║╣ ║╣ ╚═╗  ╠═╣║║║ ║║  ║║║╠═╣║║║╠═╣║ ╦║╣ ╠╦╝╚═╗
    ╚═╝╩ ╩╩  ╩═╝╚═╝ ╩ ╚═╝╚═╝╚═╝  ╩ ╩╝╚╝═╩╝  ╩ ╩╩ ╩╝╚╝╩ ╩╚═╝╚═╝╩╚═╚═╝
`)
    table(res)
    initialPrompt()
})
}


/// View annual budget by department
function viewAnnualBudget() {
  console.clear()
  principalLogo()
  con.query("SELECT name_dep AS Department, SUM(role_t.salary) AS Annual_Budget_HR FROM role_t JOIN department ON dept_id = id_dep group by name_dep;", 
  function(err, res) {
    if (err) throw err
    console.log (`
    ╔═╗╔╗╔╔╗╔╦ ╦╔═╗╦    ╔╗ ╦ ╦╔╦╗╔═╗╔═╗╔╦╗  ╔╗ ╦ ╦  ╔╦╗╔═╗╔═╗╔═╗╦═╗╔╦╗╔╦╗╔═╗╔╗╔╔╦╗
    ╠═╣║║║║║║║ ║╠═╣║    ╠╩╗║ ║ ║║║ ╦║╣  ║   ╠╩╗╚╦╝   ║║║╣ ╠═╝╠═╣╠╦╝ ║ ║║║║╣ ║║║ ║ 
    ╩ ╩╝╚╝╝╚╝╚═╝╩ ╩╩═╝  ╚═╝╚═╝═╩╝╚═╝╚═╝ ╩   ╚═╝ ╩   ═╩╝╚═╝╩  ╩ ╩╩╚═ ╩ ╩ ╩╚═╝╝╚╝ ╩ 
`)
  console.clear()
  principalLogo()
  console.log (`
    ╔═╗╔╗╔╔╗╔╦ ╦╔═╗╦    ╔╗ ╦ ╦╔╦╗╔═╗╔═╗╔╦╗  ╔╗ ╦ ╦  ╔╦╗╔═╗╔═╗╔═╗╦═╗╔╦╗╔╦╗╔═╗╔╗╔╔╦╗
    ╠═╣║║║║║║║ ║╠═╣║    ╠╩╗║ ║ ║║║ ╦║╣  ║   ╠╩╗╚╦╝   ║║║╣ ╠═╝╠═╣╠╦╝ ║ ║║║║╣ ║║║ ║ 
    ╩ ╩╝╚╝╝╚╝╚═╝╩ ╩╩═╝  ╚═╝╚═╝═╩╝╚═╝╚═╝ ╩   ╚═╝ ╩   ═╩╝╚═╝╩  ╩ ╩╩╚═ ╩ ╩ ╩╚═╝╝╚╝ ╩ 
    `)
    table(res)
    initialPrompt()
})
}

/// Add DEPARTMENT

function addDepartment() {
  console.clear()
  principalLogo()

  con.query("SELECT id_dep AS 'ID_Dep', name_dep AS 'Department' FROM department ORDER BY id_dep ASC;", 
function(err, res) {
  if (err) throw err
 
  //calvin s
  console.log(`
  ╔═╗╔╦╗╔╦╗  ╔╦╗╔═╗╔═╗╔═╗╦═╗╔╦╗╔╦╗╔═╗╔╗╔╔╦╗╔═╗
  ╠═╣ ║║ ║║   ║║║╣ ╠═╝╠═╣╠╦╝ ║ ║║║║╣ ║║║ ║ ╚═╗
  ╩ ╩═╩╝═╩╝  ═╩╝╚═╝╩  ╩ ╩╩╚═ ╩ ╩ ╩╚═╝╝╚╝ ╩ ╚═╝
      `)
  table(res)



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

  con.query(`INSERT INTO department (name_dep) VALUES ("${answer.newDep}");`, 
  function(err, res) {
    if (err) throw err
    viewDepartments()
 
}) })
})}


/// Add role

function addRole() {
  console.clear()
  principalLogo()

  con.query("SELECT DISTINCT id_role as ID_Role, title as Title, salary AS Annual_Salary, d.id_dep AS ID_Dep, name_dep AS Department FROM role_t AS r RIGHT JOIN department AS d ON dept_id = id_dep ORDER BY id_role DESC;", 
function(err, res) {
  if (err) throw err
  const nameDep = [...new Set(res.map(x => x.ID_Dep))];
  console.log(`
            ╔═╗╔╦╗╔╦╗  ╦═╗╔═╗╦  ╔═╗╔═╗
            ╠═╣ ║║ ║║  ╠╦╝║ ║║  ║╣ ╚═╗
            ╩ ╩═╩╝═╩╝  ╩╚═╚═╝╩═╝╚═╝╚═╝
                          `)
  table(res)
 


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
    viewRoles()
   
}) })
})}



/// Add employee

function addEmployee() {
  console.clear()
  principalLogo()
  con.query("SELECT id_emp AS ID_Emp, e.first_name AS First_Name_Emp, e.last_name AS Last_Name_Emp, manager.id_man AS Manager_ID, id_role AS ID_Role, title AS Title,  salary AS Annual_Salary, dept_id as Dept_ID FROM employee AS e RIGHT JOIN role_t AS r LEFT JOIN manager ON role_id = id_role ON man_id = id_man order by id_emp DESC;", 
function(err, res) {
  if (err) throw err
  const nameRole = [...new Set(res.map(x => x.ID_Role))];
  const nameManager = [];
  for (let i = 0; i < res.length; i++) {
    const id_emp = res[i].Manager_ID;
    if (id_emp !== null) {
      nameManager.push(id_emp);
    } 
  }

    function removeDuplicates(nameManager) {
    return nameManager.filter((item, index) => nameManager.indexOf(item) === index);
  }




  console.log(`

                      ╔═╗╔╦╗╔╦╗  ╔═╗╔╦╗╔═╗╦  ╔═╗╦ ╦╔═╗╔═╗╔═╗
                      ╠═╣ ║║ ║║  ║╣ ║║║╠═╝║  ║ ║╚╦╝║╣ ║╣ ╚═╗
                      ╩ ╩═╩╝═╩╝  ╚═╝╩ ╩╩  ╩═╝╚═╝ ╩ ╚═╝╚═╝╚═╝
                                          
                                        `)
  table(res)
 
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
    choices: nameRole,
  },
  {
    type: 'list',
    message: 'What is the employee`s manager ID? If you do not know the manager ID, press ENTER',
    name: 'manager',
    choices: removeDuplicates(nameManager),
  },
]).then(function(answer) {
  con.query(`INSERT INTO employee (first_name, last_name, role_id, man_id) VALUES ("${answer.newFirstName}","${answer.newLastName}",${answer.role}, ${answer.manager});`, 
  function(err, res) {
    if (err) throw err
    viewEmployees()
   
}) })
})}


/// Update employee

function updateEmployeeRole() {
  console.clear()
  principalLogo()
  con.query("SELECT id_emp AS ID_Emp, e.first_name AS First_Name, e.last_name AS Last_Name, role_id AS Role_ID, title as Title, salary as Annual_Salary, dept_id AS Dep_id FROM employee AS e RIGHT JOIN role_t AS r ON e.role_id = r.id_role; ", 
function(err, res) {
  if (err) throw err

// SET id role
  const roles = [];
  for (let i = 0; i < res.length; i++) {
    const roleId = res[i].Role_ID;
    if (roleId !== null) {
      roles.push(roleId);
    }
  }

  function removeDuplicatesRoles(roles) {
    return roles.filter((item, index) => roles.indexOf(item) === index);
  }



// SET id employee
  const employees = [];
  for (let i = 0; i < res.length; i++) {
    const id_emp = res[i].ID_Emp;
    if (id_emp !== null) {
      employees.push(id_emp);
    }
  }


  console.log(`

                              ╦ ╦╔═╗╔╦╗╔═╗╔╦╗╔═╗  ╦═╗╔═╗╦  ╔═╗
                              ║ ║╠═╝ ║║╠═╣ ║ ║╣   ╠╦╝║ ║║  ║╣ 
                              ╚═╝╩  ═╩╝╩ ╩ ╩ ╚═╝  ╩╚═╚═╝╩═╝╚═╝
                                          
                                        `)
  table(res)
 
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
    choices: removeDuplicatesRoles(roles),
  },
]).then(function(answer) {
  con.query(`UPDATE employee SET role_id = ${answer.roleId} where id_emp = ${answer.employeeID}; `, 
  function(err, res) {
    if (err) throw err
    viewEmployees();
   
}) })
})}


/// Update employee`s manager

function updateEmployeeManager() {
  console.clear()
  principalLogo()
  con.query("SELECT id_emp AS ID_Emp, e.first_name AS First_Name_Emp, e.last_name AS Last_Name_Emp, id_man AS Man_ID, m.first_name AS First_Name_Man, m.last_name AS Last_Name_Man FROM employee AS e RIGHT JOIN manager AS m ON man_id = id_man ORDER BY id_emp DESC;", 
function(err, res) {
  
  if (err) throw err
  const manager = [...new Set(res.map(x => x.Man_ID))];
  const employees = [];
for (let i = 0; i < res.length; i++) {
  const id_emp = res[i].ID_Emp;
  if (id_emp !== null) {
    employees.push(id_emp);
  }
}


  console.log(`

                  ╦ ╦╔═╗╔╦╗╔═╗╔╦╗╔═╗  ╔╦╗╔═╗╔╗╔╔═╗╔═╗╔═╗╦═╗
                  ║ ║╠═╝ ║║╠═╣ ║ ║╣   ║║║╠═╣║║║╠═╣║ ╦║╣ ╠╦╝
                  ╚═╝╩  ═╩╝╩ ╩ ╩ ╚═╝  ╩ ╩╩ ╩╝╚╝╩ ╩╚═╝╚═╝╩╚═
                                          
                                        `)
  table(res)
 
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
    viewManagers();
}) })
})}



//// HANDLE DELETES


function deleteElements() {
  console.clear()
  principalLogo()

  inquirer.prompt([
    {
    type: "list",
    message: "What would you like to do?",
    name: "choice",
    choices: [
              "Delete a Department", 
              "Delete a role",
              "Delete an employee",
            ],
  validate: function (answer) {
              if (answer.length === 0) {
                return console.log("Select one!");
              }
              return true;
      
            }
      
    }
]).then(function(answer) {
    if (answer.choice === "Delete a Department") {
      deleteDepartment()
    } else if (answer.choice === "Delete a role") {
      deleteRole()
    } else if (answer.choice === "Delete an employee") {
      deleteEmployee()
  
  }
})
}


/// delete department
function deleteDepartment() {
  console.clear()
  principalLogo()
  console.log(`
 ╔╦╗╔═╗╦  ╔═╗╔╦╗╔═╗  ╔╦╗╔═╗╔═╗╔═╗╦═╗╔╦╗╔╦╗╔═╗╔╗╔╔╦╗╔═╗
  ║║║╣ ║  ║╣  ║ ║╣    ║║║╣ ╠═╝╠═╣╠╦╝ ║ ║║║║╣ ║║║ ║ ╚═╗
 ═╩╝╚═╝╩═╝╚═╝ ╩ ╚═╝  ═╩╝╚═╝╩  ╩ ╩╩╚═ ╩ ╩ ╩╚═╝╝╚╝ ╩ ╚═╝
    `)
    con.query("SELECT id_dep AS 'ID_Department', name_dep AS 'Department' from department;", 
    function(err, res) {
      if (err) throw err
      table(res)
      const nameDep = [...new Set(res.map(x => x.ID_Department))]

  inquirer.prompt([
    {
      type: 'list',
      message: 'Which department do you want to delete?',
      name: 'deleteDep',
      choices: nameDep,
    },
  ]) .then(function(answer) {
      con.query(`DELETE FROM department WHERE id_dep = ${answer.deleteDep};`, 
      function(err, res) {
        if (err) throw err
        viewDepartments()
    }) })

  })

}


/// delete ROLE
function deleteRole() {
  console.clear()
  principalLogo()
  console.log(`
      ╔╦╗╔═╗╦  ╔═╗╔╦╗╔═╗  ╦═╗╔═╗╦  ╔═╗╔═╗
       ║║║╣ ║  ║╣  ║ ║╣   ╠╦╝║ ║║  ║╣ ╚═╗
      ═╩╝╚═╝╩═╝╚═╝ ╩ ╚═╝  ╩╚═╚═╝╩═╝╚═╝╚═╝
    `)
    con.query("SELECT id_role AS ID_Role, title AS Title, salary AS Annual_Salary, dept_id AS Dept_ID FROM role_t;", 
    function(err, res) {
      if (err) throw err
      table(res)
      const roleId = [...new Set(res.map(x => x.ID_Role))]

  inquirer.prompt([
    {
      type: 'list',
      message: 'Which role do you want to delete?',
      name: 'deleteRole',
      choices: roleId,
    },
  ]) .then(function(answer) {
      con.query(`DELETE FROM role_t WHERE id_role = ${answer.deleteRole};`, 
      function(err, res) {
        if (err) throw err
        viewRoles()
    }) })

  })

}



/// delete Employee
function deleteEmployee() {
  console.clear()
  principalLogo()
  console.log(`
 ╔╦╗╔═╗╦  ╔═╗╔╦╗╔═╗  ╔═╗╔╦╗╔═╗╦  ╔═╗╦ ╦╔═╗╔═╗╔═╗
  ║║║╣ ║  ║╣  ║ ║╣   ║╣ ║║║╠═╝║  ║ ║╚╦╝║╣ ║╣ ╚═╗
 ═╩╝╚═╝╩═╝╚═╝ ╩ ╚═╝  ╚═╝╩ ╩╩  ╩═╝╚═╝ ╩ ╚═╝╚═╝╚═╝
    `)
    con.query('SELECT id_emp AS ID_Emp, first_name AS First_Name, last_name AS Last_Name, role_id AS Role, man_id AS Manager_ID from employee;', 
    function(err, res) {
      if (err) throw err
      table(res)
      const employeeID = [...new Set(res.map(x => x.ID_Emp))]

  inquirer.prompt([
    {
      type: 'list',
      message: 'Which employee do you want to delete?',
      name: 'deleteEmp',
      choices: employeeID,
    },
  ]) .then(function(answer) {
      con.query(`DELETE FROM employee WHERE id_emp = ${answer.deleteEmp};`, 
      function(err, res) {
        if (err) throw err
        viewEmployees()
    }) })

  })

}









