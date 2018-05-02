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
            const text = 'INSERT INTO "user"(email, pass_hash, date_created, name) VALUES($1,$2,NOW(),$3) RETURNING id;';
            const values = [data.email, hash, data.name];
            console.log(text);
            pool.connect((err, client, done) => {
                client.query(text, values)
                .then((dat) => {
                    done();
                    res.send(dat.rows[0]);
                    console.log(dat);
                    // Generate a token and return that
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
                console.log(result)  // Generate a token and return that
            });
        })
    });
});

router.post('/mule', function(req, res) {
    const data = req.body.data
    const user = data.userid
    const mule = data.muleid

    // Check users token

    const query = 'SELECT * FROM "mule" WHERE master_user=$1'
    pool.connect((err, client, done) => {
        client.query(query, user)
        .then((dat) => {
            done();
            console.log(dat)
            // Return a list of the users mules
        })
    })
});

router.post('/mule', function(req, res) {
    const data = req.body.data
    const user = data.userid
    const ip = data.ip
    const port = data.port
    const name = data.name
    const query = 'INSERT INTO "mule"(master_user, ip, port, name, last_seen) VALUES($1,$2,$3,$4,NOW()) RETURNING id;'
    const values = [user,ip,port,name]

    pool.connect((err, client, done) => {
        client.query(query, values)
        .then((dat) => {
            done();
            console.log(dat)
            res.send(dat.rows[0])
        })
    })
});

app.listen(port);
console.log('Server has been started on port ' + port);