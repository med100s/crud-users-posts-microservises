const express = require('express');
const app = express()
const posts_server_port = require('../env')['posts_server_port']
const users_server_port = require('../env')['users_server_port']
const gateaway_server_port = require('../env')['gateaway_server_port']
const axios = require('axios')

const bodyParser = require('body-parser');
app.use(bodyParser.json())

//auth post to user-crud server
//request succed or not 

app.post('/register', async (req, res) => {

    const login = req.body.login
    const password = req.body.password

    let name = 'notProvided'
    let lastname = 'notProvided'

    console.log(req.body)
    await axios.post(`http://localhost:${users_server_port}/register`, {
        login: login,
        password: password,
        name: 'name',
        lastname: 'lastname'
    })
        .then(resp => { console.log('succed'); res.status(200).send('succed') })
        .catch(resp => { console.log('not succed'); res.status(400).send('something wrong maybe you provided bad credentials') })
    console.log('something')
});

//login post to user-crud server
//request jwt token or err

app.post('/login', async (req, res) => {

    const login = req.body.login
    const password = req.body.password

    console.log(req.body)
    await axios.post(`http://localhost:${users_server_port}/login`, {
        login: login,
        password: password
    })
        .then(resp => { console.log('succed'); res.status(200).send(resp.data) })
        .catch(resp => { console.log('not succed'); res.status(400).send('something wrong maybe you provided bad credentials') })
    console.log('something')
});

app.post('/create', async (req, res) => {
    let text = 'notProvided'
    if (req.body.text) text = req.body.text


    console.log(req.body)
    await axios.post(`http://localhost:${posts_server_port}/create`, {
        text: text
    }, {
        headers: {
            authorization: req.headers.authorization
        }
    })
        .then(resp => { console.log('succed'); res.status(200).send(resp.data) })
        .catch(resp => { console.log('not succed'); res.status(400).send('something wrong maybe you provided bad credentials') })
    console.log('something')
});

app.get('/get', async (req, res) => {

    await axios.get(`http://localhost:${posts_server_port}/get`, {
        headers: {
            authorization: req.headers.authorization
        }
    })
        .then(resp => { console.log('succed'); res.status(200).send(resp.data) })
        .catch(resp => { console.log('not succed'); res.status(400).send('something wrong maybe you provided bad credentials') })
    console.log('something')
});

app.post('/delete', async (req, res) => {

    console.log(req.body)
    await axios.post(`http://localhost:${posts_server_port}/delete`, {
        id: req.body.id
    }, {
        headers: {
            authorization: req.headers.authorization
        }
    })
        .then(resp => { console.log('succed'); res.status(200).send(resp.data) })
        .catch(resp => { console.log('not succed'); res.status(400).send('something wrong maybe you provided bad credentials') })
    console.log('something')
});

//delete delete to user-crud server jwt param
//request succed or not

app.listen(gateaway_server_port, () => {
    console.log(`Example app listening on port ${gateaway_server_port}`)
})