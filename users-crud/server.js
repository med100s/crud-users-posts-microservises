const express = require('express');
const app = express()
const port = require('../env')['users_server_port']

const jwt_secret = require('../env')['jwt_secret']
const jwt = require('jsonwebtoken');

const mysql = require('mysql');
const dbtablename = 'userstable'

const bodyParser = require('body-parser');
app.use(bodyParser.json())


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'admin',
    database: 'test'
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

// connection.query(`SELECT * FROM ${dbtablename}`, function (error, results, fields) {
//     if (error) throw error;
//     console.log(results);
// });
// connection.query("INSERT INTO `userstable`(`id`, `login`, `password`, `name`, `lastname`) VALUES ('[value-1]','[value-2]','[value-3]','[value-4]','[value-5]')",
//         function (error, results, fields) {
//             if (error) throw error;
//             console.log(results);
//         });

// 

// var token = jwt.sign({ foo: 'bar', }, 'jwt_secret' );
// console.log(token)
// connection.query({
//     sql: `SELECT * FROM ${dbtablename} WHERE login = ? AND password = ?`,
//     values: ['[value-2]', '[value-3]']
// }, function (error, results, fields) {
//     if (error) throw error;
//     console.log(results);
// });

// connection.query({
//     sql: `SELECT * FROM ${dbtablename} WHERE login = ? AND password = ?`,
//     values: ['[value-2]', '[value-3]']
// }, function (error, results, fields) {

//     if (error) throw error;
//     console.log(results[0].id)
//     if (results.length === 1) {

//         var token = jwt.sign({ id: results[0].id, login: results[0].login, password: results[0].password }, jwt_secret);
//         console.log(token)

//     }

// });





//add user to db   
app.post('/register', (req, res) => {

    const login = req.body.login
    const password = req.body.password

    let name = 'notProvided'
    let lastname = 'notProvided'
    try {
        name = req.body.name
        lastname = req.body.lastname
    } catch { }
    console.log(req.body)
    connection.query({
        sql: `INSERT INTO ${dbtablename}(\`login\`, \`password\`, \`name\`, \`lastname\`) values (?, ?, ?, ?)`,
        values: [login, password, name, lastname]
    },
        function (error, results, fields) {
            if (error) res.status(400).send('user already exist i guess');
            else res.status(200).send('user created successfully')
        }
    );

})

//get token from user

app.post('/login', (req, res) => {

    const login = req.body.login
    const password = req.body.password

    connection.query({
        sql: `SELECT * FROM ${dbtablename} WHERE login = ? AND password = ?`,
        values: [login, password]
    }, async function (error, results, fields) {
        if (error) { res.status(400).send('something went wrong i gues you provided bad credentials'); }
        else {
            console.log(results[0])

            if (results.length === 1) {

                const token = await jwt.sign({
                    id: results[0].id,
                    login: results[0].login,
                    password: results[0].password
                }, jwt_secret);

                console.log(token)

                res.status(200).send({
                    token: token,
                    id: results[0].id,
                    login: results[0].login,
                    password: results[0].password
                })

            } else {
                res.status(400).send('something went wrong i gues you provided bad credentials')
            }
        }


    });

})
//delete user 
app.delete('/delete', (req, res) => {
    res.send('Hello World!')
})
//change user // not neccessary


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})