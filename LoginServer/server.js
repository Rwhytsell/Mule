const express = require('express')
const bodyParser = require('body-parser')
const { Client } = require('pg')
const configFile = require('./config.json')

var dbConfig = configFile.db;

const client = new Client(dbConfig);

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = 8080;

var router = express.Router();

// router.get('/user' , function(req, res) {});
    

app.post('/api/login', function(req, res) {
    console.log('Post on login');

    const text = 'INSERT INTO users(name, email) VALUES($1, $2, NOW(), $3) RETURNING *'
    const values = ['EMAIL', 'PASS_HASH', 'USERS_NAME']

    // Connect to db and insert new user
    client.connect()
    client.query(text, values)
    .then(res => {
        console.log(res.rows[0])
    })
    .catch(e => console.error(e.stack))
    });

// router.get('/mule', function(req, res) {});

// router.post('/mule', function(req, res) {});

// app.use('/api', router)

app.listen(port);
console.log('Server has been started on port ' + port);