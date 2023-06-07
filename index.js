const inquirer = require('inquirer');
const mysql = require('mysql2');
const { Console } = require('console');
const util = require('util');
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

con.query = util.promisify(con.query);


// https://www.javascripttutorial.net/array/javascript-remove-duplicates-from-array/
// https://www.geeksforgeeks.org/how-to-remove-duplicate-elements-from-javascript-array/


function principalLogo() {
  console.log(`
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
        "Update employee's Role",
        "Update employee's Manager",
        "Delete departments, roles, and employees"
      ],
      pageSize: 12,
      validate: function (answer) {
        if (answer.length === 0) {
          return console.log("Select one!");
        }
        return true;

      }

    }
  ]).then(function (answer) {

    const userChoice = answer.choice;

    switch (userChoice) {
      case "View All Employees":
        viewEmployees();
        break;
      case "View All Departments":
        viewDepartments();
        break;
      case "View All Roles":
        viewRoles();
        break;
      case "View employees by manager":
        viewManagers();
        break;
      case "View employees by department":
        viewEmployDepart();
        break;
      case "View annual budget by department":
        viewAnnualBudget();
        break;
      case "Add a Department":
        addDepartment();
        break;
      case "Add a Role":
        addRole();
        break;
      case "Add an Employee":
        addEmployee();
        break;
      case "Update employee's Role":
        updateEmployeeRole();
        break;
      case "Update employee's Manager":
        updateEmployeeManager();
        break;
      case "Delete departments, roles, and employees":
        deleteElements();
        break;
      default:
        console.log("Invalid choice. Please try again.");
    }


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
  con.query("SELECT e.id_emp AS ID_E, e.first_name AS F_Name_E, e.last_name AS L_Name_E, COALESCE(title, 'N/A') AS Title, COALESCE(FORMAT(salary,2), 'N/A') AS Salary, COALESCE(id_dep, 'N/A') AS ID_Dep, COALESCE(name_dep, 'N/A') AS Department, COALESCE(m.first_name, 'N/A') AS F_Name_Man, COALESCE(m.last_name, 'N/A') AS L_Name_Man FROM employee AS e LEFT JOIN manager as m ON man_id = id_man LEFT JOIN role_t AS r ON e.role_id = r.id_role LEFT JOIN department AS d ON r.dept_id = id_dep   ORDER BY id_emp ASC;",
    function (err, res) {
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
  con.query("SELECT id_dep AS 'ID Department', name_dep AS 'Department' from department ORDER BY id_dep ASC;",
    function (err, res) {
      if (err) throw err


      table(res)
      initialPrompt()
    })

}


/// View roles

function viewRoles() {
  console.clear()
  principalLogo()
  console.log(`
                  ╦═╗╔═╗╦  ╔═╗╔═╗
                  ╠╦╝║ ║║  ║╣ ╚═╗
                  ╩╚═╚═╝╩═╝╚═╝╚═╝
`)
  con.query("SELECT id_role AS ID_Role, title AS Title, FORMAT(salary,2) AS Annual_Salary, coalesce(name_dep, 'N/A') AS Department FROM role_t left join department on dept_id = id_dep;",
    function (err, res) {
      if (err) throw err



      table(res)
      initialPrompt()

    })
}


/// View employees by manager

function viewEmployDepart() {
  console.clear()
  principalLogo()
  con.query("SELECT e.id_emp AS 'ID Emp', e.first_name AS 'First Name - Emp', e.last_name AS 'Last Name - Emp', r.dept_id AS 'ID Dep' , name_dep AS 'Department' FROM employee AS e JOIN role_t AS r ON e.role_id = r.id_role JOIN department AS d ON r.dept_id = id_dep ORDER BY id_emp ASC;",
    function (err, res) {
      if (err) throw err
      console.log(`
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
  con.query("SELECT em.id_emp as Id_E, em.first_name as F_Name_E, em.last_name AS L_Name_E, COALESCE(man_id, 'N/A') as Man_ID, COALESCE(man.first_name, 'N/A') AS F_Name_Man, COALESCE(man.last_name, 'N/A') AS L_Name_Man FROM employee as em left JOIN manager as man ON em.man_id = man.id_man order by id_emp ASC;",
    function (err, res) {
      if (err) throw err
      console.log(`
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
  con.query("SELECT department.name_dep AS Department, FORMAT(SUM(role_t.salary), 2) AS Salary_Budge FROM employee RIGHT JOIN role_t ON employee.role_id = role_t.id_role JOIN department ON role_t.dept_id = department.id_dep WHERE id_emp IS NOT NULL GROUP BY department.name_dep WITH ROLLUP;",
    function (err, res) {
      if (err) throw err
      console.log(`
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
  con.query("SELECT id_dep AS 'ID_Dep', name_dep AS 'Department' FROM department ORDER BY id_dep ASC;",
    function (err, res) {
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
          pageSize: 15,
        },
      ]).then(function (answer) {

        con.query(`INSERT INTO department (name_dep) VALUES ("${answer.newDep}");`,
          function (err, res) {
            if (err) throw err
            viewDepartments()

          })
      })
    })
}


/// Add role

async function addRole() {
  console.clear()


  console.log(`
              ╔═╗╔╦╗╔╦╗  ╦═╗╔═╗╦  ╔═╗╔═╗
              ╠═╣ ║║ ║║  ╠╦╝║ ║║  ║╣ ╚═╗
              ╩ ╩═╩╝═╩╝  ╩╚═╚═╝╩═╝╚═╝╚═╝
                            `)


  const departments = await con.query("SELECT * FROM department;")
  const departmentChoices = departments.map(({ id_dep, name_dep }) => ({
    name: name_dep,
    value: id_dep
  }))


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
      name: 'dept_id',
      choices: departmentChoices,
      pageSize: 15,
    },

  ]).then(function (answer) {
    con.query(`INSERT INTO role_t (title, salary, dept_id) VALUES ("${answer.newRole}", ${answer.newSalary},${answer.dept_id});`,
      function (err, res) {
        if (err) throw err
        viewRoles()

      })
  })
}



/// Add employee

async function addEmployee() {
console.clear()
  console.log(`

  ╔═╗╔╦╗╔╦╗  ╔═╗╔╦╗╔═╗╦  ╔═╗╦ ╦╔═╗╔═╗╔═╗
  ╠═╣ ║║ ║║  ║╣ ║║║╠═╝║  ║ ║╚╦╝║╣ ║╣ ╚═╗
  ╩ ╩═╩╝═╩╝  ╚═╝╩ ╩╩  ╩═╝╚═╝ ╩ ╚═╝╚═╝╚═╝
                      
                    `)

  const roles = await con.query("SELECT * FROM role_t;")
  const roleChoices = roles.map(({ id_role, title }) => ({
    name: title,
    value: id_role
  }))
  roles.unshift({ name: "Non", value: null });


  const manager = await con.query("SELECT * FROM manager;")
  const managerChoices = manager.map(({ id_man, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id_man
  }))
  managerChoices.push({ name: "N/A", value: null })





  // table(res)

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
      choices: roleChoices,
      pageSize: 15,
    },
    {
      type: 'list',
      message: 'What is the employee`s manager ID?',
      name: 'manager',
      choices: managerChoices,
      pageSize: 15,
    },
  ]).then(function (answer) {
    con.query(`INSERT INTO employee (first_name, last_name, role_id, man_id) VALUES ("${answer.newFirstName}","${answer.newLastName}",${answer.role}, ${answer.manager});`,
      function (err, res) {
        if (err) throw err
        viewEmployees()

      })
  })
}


/// Update employee

async function updateEmployeeRole() {
  console.clear()

  console.log(`

                              ╦ ╦╔═╗╔╦╗╔═╗╔╦╗╔═╗  ╦═╗╔═╗╦  ╔═╗
                              ║ ║╠═╝ ║║╠═╣ ║ ║╣   ╠╦╝║ ║║  ║╣ 
                              ╚═╝╩  ═╩╝╩ ╩ ╩ ╚═╝  ╩╚═╚═╝╩═╝╚═╝
                                          
                                        `)

  // SET id role
  const roles = await con.query("SELECT * FROM role_t;")
  const roleChoices = roles.map(({ id_role, title }) => ({
    name: title,
    value: id_role
  }))
  roles.unshift({ name: "Non", value: null });


  // SET id employee
  const employee = await con.query("SELECT * FROM employee;")
  const employees = employee.map(({ id_emp, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id_emp
  }
  ))



  inquirer.prompt([
    {
      type: 'list',
      message: 'Select an employee ID to update their role?',
      name: 'employeeID',
      choices: employees,
      pageSize: 15,
    },
    {
      type: 'list',
      message: 'What is the new employee`s role?',
      name: 'roleId',
      choices: roleChoices,
      pageSize: 15,
    },
  ]).then(function (answer) {
    con.query(`UPDATE employee SET role_id = ${answer.roleId} where id_emp = ${answer.employeeID}; `,
      function (err, res) {
        if (err) throw err
        viewEmployees();

      })
  })
}



/// Update employee`s manager

async function updateEmployeeManager() {
  console.clear()

  console.log(`

                  ╦ ╦╔═╗╔╦╗╔═╗╔╦╗╔═╗  ╔╦╗╔═╗╔╗╔╔═╗╔═╗╔═╗╦═╗
                  ║ ║╠═╝ ║║╠═╣ ║ ║╣   ║║║╠═╣║║║╠═╣║ ╦║╣ ╠╦╝
                  ╚═╝╩  ═╩╝╩ ╩ ╩ ╚═╝  ╩ ╩╩ ╩╝╚╝╩ ╩╚═╝╚═╝╩╚═
                          
                        `)


  const employee = await con.query("SELECT * FROM employee;")
  const employees = employee.map(({ id_emp, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id_emp
  }
  ))
  const manager = await con.query("SELECT * FROM manager;")
  const managerChoices = manager.map(({ id_man, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id_man
  }))




  inquirer.prompt([
    {
      type: 'list',
      message: 'Select an employee ID to update their manager?',
      name: 'employeeID',
      choices: employees,
      pageSize: 15,
    },
    {
      type: 'list',
      message: 'What is the new employee`s manager?',
      name: 'managerId',
      choices: managerChoices,
      pageSize: 15,
    },
  ]).then(function (answer) {
    con.query(`UPDATE employee SET man_id = ${answer.managerId} where id_emp = ${answer.employeeID}; `,
      function (err, res) {
        if (err) throw err
        viewManagers();
      })
  })
}



//// HANDLE DELETES


function deleteElements() {
  console.clear()


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

      },
      pageSize: 15,
    }
  ]).then(function (answer) {
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
async function deleteDepartment() {
  console.clear()

  console.log(`
 ╔╦╗╔═╗╦  ╔═╗╔╦╗╔═╗  ╔╦╗╔═╗╔═╗╔═╗╦═╗╔╦╗╔╦╗╔═╗╔╗╔╔╦╗╔═╗
  ║║║╣ ║  ║╣  ║ ║╣    ║║║╣ ╠═╝╠═╣╠╦╝ ║ ║║║║╣ ║║║ ║ ╚═╗
 ═╩╝╚═╝╩═╝╚═╝ ╩ ╚═╝  ═╩╝╚═╝╩  ╩ ╩╩╚═ ╩ ╩ ╩╚═╝╝╚╝ ╩ ╚═╝
    `)

      const department = await con.query("SELECT * FROM department;")
      const depChoices = department.map(({ id_dep, name_dep }) => ({
        name: name_dep,
        value: id_dep
      }))
      

      inquirer.prompt([
        {
          type: 'list',
          message: 'Which department do you want to delete?',
          name: 'deleteDep',
          choices: depChoices,
          pageSize: 15,
        },
      ]).then(function (answer) {
        con.query(`DELETE FROM department WHERE id_dep = ${answer.deleteDep};`,
          function (err, res) {
            if (err) throw err
            viewDepartments()
          })
      })

    }


/// delete ROLE
async function deleteRole() {
  console.clear()

  console.log(`
      ╔╦╗╔═╗╦  ╔═╗╔╦╗╔═╗  ╦═╗╔═╗╦  ╔═╗╔═╗
       ║║║╣ ║  ║╣  ║ ║╣   ╠╦╝║ ║║  ║╣ ╚═╗
      ═╩╝╚═╝╩═╝╚═╝ ╩ ╚═╝  ╩╚═╚═╝╩═╝╚═╝╚═╝
    `)


      const roles = await con.query("SELECT * FROM role_t;")
      const roleChoices = roles.map(({ id_role, title }) => ({
        name: title,
        value: id_role
      }))


      roles.unshift({ name: "Non", value: null });
      
      
      inquirer.prompt([
        {
          type: 'list',
          message: 'Which role do you want to delete?',
          name: 'deleteRole',
          choices: roleChoices,
          pageSize: 15,
        },
      ]).then(function (answer) {
        con.query(`DELETE FROM role_t WHERE id_role = ${answer.deleteRole};`,
          function (err, res) {
            if (err) throw err
            viewRoles()
          })
      })

    }



/// delete Employee
async function deleteEmployee() {
  console.clear()
 
  console.log(`
 ╔╦╗╔═╗╦  ╔═╗╔╦╗╔═╗  ╔═╗╔╦╗╔═╗╦  ╔═╗╦ ╦╔═╗╔═╗╔═╗
  ║║║╣ ║  ║╣  ║ ║╣   ║╣ ║║║╠═╝║  ║ ║╚╦╝║╣ ║╣ ╚═╗
 ═╩╝╚═╝╩═╝╚═╝ ╩ ╚═╝  ╚═╝╩ ╩╩  ╩═╝╚═╝ ╩ ╚═╝╚═╝╚═╝
    `)
 


  const employee = await con.query("SELECT * FROM employee;")
  const employees = employee.map(({ id_emp, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id_emp
  }
  ))

      inquirer.prompt([
        {
          type: 'list',
          message: 'Which employee do you want to delete?',
          name: 'deleteEmp',
          choices: employees,
          pageSize: 15,
        },
      ]).then(function (answer) {
        con.query(`DELETE FROM employee WHERE id_emp = ${answer.deleteEmp};`,
          function (err, res) {
            if (err) throw err
            viewEmployees()
          })
      })

    }









