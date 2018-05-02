const express = require('express')
const bodyParser = require('body-parser')
const { Pool } = require('pg')
const bcrypt = require('bcrypt')

const configFile = require('./config.json')

var dbConfig = configFile.db;

const pool = new Pool(dbConfig);

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = 8080;

var router = express.Router();

// router.get('/user' , function(req, res) {});
    

app.post('/api/register', function(req, res) {
    console.log('Post on register');
    const data = req.body.data;
    bcrypt.hash(data.password, 10, function(err, hash) {
        if(!err){
            const text = 'INSERT INTO "user"(email, pass_hash, date_created, name) VALUES($1,$2,NOW(),$3) RETURNING *;';
            const values = [data.email, hash, data.name];
            console.log(text);
            pool.connect((err, client, done) => {
                client.query(text, values)
                .then((dat) => {
                    done();
                    res.send(dat.rows[0]);
                    console.log(dat);
                })
                .catch(err => res.send(err.stack));
            })
        } else {
            res.send(err);
        }
    });
});

app.post('/api/login', function(req, res) {
    console.log('Post on login')
    const data = req.body.data;
    const query = 'SELECT pass_hash FROM "user" WHERE email=$1'
    const values = [data.email]
    pool.connect((err, client, done) => {
        client.query(query, values)
        .then((dat) => {
            done();
            console.log(dat)
            bcrypt.compare(data.password, dat.rows[0].pass_hash).then(function(result) {
                console.log(result)
            });
        })
    });
});

// router.get('/mule', function(req, res) {});

// router.post('/mule', function(req, res) {});

app.listen(port);
console.log('Server has been started on port ' + port);