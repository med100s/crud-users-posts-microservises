const express = require('express');
const app = express()
const port = require('../env')['posts_server_port']

const jwt_secret = require('../env')['jwt_secret']
const jwt = require('jsonwebtoken');

const mysql = require('mysql');
const dbtablename = 'poststable'

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

try {
    var decoded = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDcsImxvZ2luIjoieGJ4YmJidmJ2YiIsInBhc3N3b3JkIjoibXlfcGFzc3dvcmQiLCJpYXQiOjE2NTE3NTA5MjB9.rZeWBK11TdfzYEDVDbJyOOs-BPMTpaNad2ZIGylaHps', jwt_secret);
    console.log(decoded)
} catch (err) {
    // err
}

// connection.query({
//     sql: `INSERT INTO ${dbtablename}(\`loginid\`, \`login\`, \`text\` ) values (?,?,?)`,
//     values: [decoded.id, decoded.login, 'some text']
// }, function (error, results, fields) {
//     if (error) throw error;
//     console.log(results);
// });

//   connection.query({
//         sql: `SELECT * FROM ${dbtablename} WHERE loginid = ? AND login = ?`,
//         values: [decoded.id, decoded.login]
//     }, function (error, results, fields) {
//         if (error) throw error;
//         console.log(results);
//     });

//create post
app.post('/create', (req, res) => {
    let text = 'notProvided' 
    if(req.body.text) text = req.body.text
   
    try {
        var decoded = jwt.verify(req.headers.authorization.split(' ')[1], jwt_secret);
        console.log(decoded) 
    } catch (err) {
        // err
    }
    connection.query({
        sql: `INSERT INTO ${dbtablename}(\`loginid\`, \`login\`, \`text\` ) values (?,?,?)`,
        values: [decoded.id, decoded.login, text]
    }, function (error, results, fields) {
        if (error) res.status(400).send('something went wrong');
        console.log(results);
        res.status(200).send('post succed')
    });

})

app.get('/get', (req, res) => {
    console.log(req.body, req.headers)
    try {
        var decoded = jwt.verify(req.headers.authorization.split(' ')[1], jwt_secret);
        console.log(decoded) 
    } catch (err) {
        // err
    }
      connection.query({
        sql: `SELECT * FROM ${dbtablename} WHERE loginid = ? AND login = ?`,
        values: [decoded.id, decoded.login]
    }, function (error, results, fields) {
        if (error) res.status(400).send('something went wrong');
        console.log(results);
        res.status(200).send(results)
    });
})


app.post('/delete', (req, res) => {

    let id = 'notProvided' 
    
    if(req.body.id) id = req.body.id

    try {
        var decoded = jwt.verify(req.headers.authorization.split(' ')[1], jwt_secret);
        console.log(decoded) 
    } catch (err) {
        // err
    }
    console.log(decoded.id, decoded.login, id)
      connection.query({
        sql: `DELETE FROM ${dbtablename} WHERE loginid = ? AND login = ? AND id = ?`,
        values: [decoded.id, decoded.login, id]
    }, function (error, results, fields) {
        if (error) res.status(400).send('something went wrong');
        console.log(results);
        res.status(200).send(results)
    });
}) 


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})