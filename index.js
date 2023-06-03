const inquirer = require('inquirer');
const mysql = require('mysql2');

// create  connection
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '17250967',
  database: 'humanResources_db'
});

con.promise()
  .query('SELECT * FROM employee')
  .then(([rows, fields]) => {
    // Store the employee data
    const employees = rows;

    // Questions
    inquirer
      .prompt([
        {
          type: 'list',
          message: 'What do you like to do?',
          name: 'todo',
          choices: [
            'View All Employees',
            'Add Employee',
            'Update Employee Role',
            'View All Role',
            'View All Departments',
            'Add Department',
            'Exit'
          ],
          validate: function (answer) {
            if (answer.length === 0) {
              return console.log('Select one!');
            }
            return true;
          }
        }
      ])
      .then((response) => {
        if (response.todo === 'View All Employees') {
          inquirer
            .prompt([
              {
                type: 'list',
                message: 'Employees',
                name: 'todo',
                choices: employees.map((employee) => employee.first_name),
                validate: function (answer) {
                  if (answer.length === 0) {
                    return console.log('Select one!');
                  }
                  return true;
                }
              }
            ])
            .then((answer) => {
              console.log(answer, 'newEmployee');
            })
            .catch((error) => {
              if (error) throw error;
              console.log('added employee');
            });
        }
      });
  })
  .catch(console.log)
  .finally(() => con.end());




  //     else if (response === "Add Employee") {
  //       inquirer
  //         .prompt([
  //           {
  //             type: 'input',
  //             message: 'What is the first name of the employee?',
  //             name: 'firstName',
  //             validate: function (answer) {
  //               if (answer.length < 2) {
  //                 return console.log("The name must has at least 3 characters");
  //               }
  //               return true;
  //             }
  //           },
  //           {
  //             type: 'input',
  //             message: 'What is the last name of the employee?',
  //             name: 'lastName',
  //             validate: function (answer) {
  //               if (answer.length < 2) {
  //                 return console.log("The name must has at least 3 characters");
  //               }
  //               return true;
  //             }
  //           },
  //           {
  //             type: 'list',
  //             message: 'What is the role of the employee?',
  //             name: 'role',
  //             choices: [], // take values from the table role. Call from a let on the top
  //             validate: function (answer) {
  //               if (answer.length === 0) {
  //                 return console.log("Select one!");
  //               }
  //               return true;
  //             },
  //           },
  //           {
  //             type: 'list',
  //             message: 'Who is thee employee`s manager? If does not have any, press enter ',
  //             name: 'manager',
  //             choices: [], // take values from the table role
  //           }
  //         ])
  //         .then((answer) => {
  //           console.log(answer, "newEmployee");
  //           function querying() {
  //           dbConnection.query("INSERT INTO employee SET ?", {
  //             first_name: answer.firstName,
  //             last_name: answer.lastName,
  //             role_id: answer.role,
  //             manager_id: answer.manager
  //           }, function (error) {
  //             if (error) throw error;
  //             console.log("added employee");
  //           }) }    
  //           querying()
  //         })
  //     }
  //   }
  // })
































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






