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
    bcrypt.hash(data.password, 10, function(err, hash) {
        if(!err){
            const text = "INSERT INTO user(id, email, pass_hash, date_created, name)" +
            " VALUES(nextval('user_id_seq'), " + data.email + "," + hash + ", NOW()," + data.name + ") RETURNING *;"; // valueFormat = ['EMAIL', 'PASS_HASH', 'NAME']
            console.log(text);
            client.connect()
                .then(() => {
                    console.log('Client Connected')
                    client.query(text, values)
                        .then(dat => res.send(dat.rows[0]))
                        .then(() => {
                            client.end();
                            console.log('Client Disconnected');
                        })
                        .catch(err => () => {
                            res.send(err.stack);
                            client.end();
                        });
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