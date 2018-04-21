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
    const text = "INSERT INTO user(id, email, pass_hash, date_created, name) VALUES($1, $2, $3, $4, $5) RETURNING *"; // valueFormat = ['EMAIL', 'PASS_HASH', 'NAME']
    bcrypt.hash(data.password, 10, function(err, hash) {
        if(!err){
            const values = ["nextval('user_id_seq'", data.email, hash, Date.now(), data.name];
            console.log(values);
            client.connect()
                .then(() => {
                    console.log('Client Connected')
                    client.query(text, values)
                        .then(dat => res.send(dat.rows[0]))
                        .then(() => {
                            client.end();
                            console.log('Client Disconnected');
                        })
                        .catch(err => res.send(err.stack));
                })
                .catch(err => res.send(err.stack));
        } else {
            res.send('Problem hashing password');
        }
    });
});

// router.get('/mule', function(req, res) {});

// router.post('/mule', function(req, res) {});

// app.use('/api', router)

app.listen(port);
console.log('Server has been started on port ' + port);