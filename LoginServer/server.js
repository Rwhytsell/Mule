const express = require('express')
const bodyParser = require('body-parser')
const { Client } = require('pg')
const bcrypt = require('bcrypt')

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
    const data = req.body.data;
    const text = 'INSERT INTO user(email, pass_hash, date_created, name) VALUES($1, $2, NOW(), $3) RETURNING *';     // valueFormat = ['EMAIL', 'PASS_HASH', 'USERS_NAME', 'NAME']
    bcrypt.hash(data.password, 10, function(err, hash) {
        if(!err){
            const values = [data.email, hash, data.name];
            console.log(values);
            // Connect to db and insert new user
            client.connect();
            client.query(text, values, (err, res) => {
                console.log(res.rows[0]);
                client.end();
            }).catch(e => console.error(e.stack));
        } else {
            console.error('Problem hashing password');
        }
    })
});

// router.get('/mule', function(req, res) {});

// router.post('/mule', function(req, res) {});

// app.use('/api', router)

app.listen(port);
console.log('Server has been started on port ' + port);