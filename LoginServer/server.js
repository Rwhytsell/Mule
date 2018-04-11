const express = require('express')
const bodyParser = require('body-parser')
const { Client } = require('pg')
const configFile = require('./config.json')

var dbConfig = configFile.db;

const client = new Client(dbConfig);

client.connect()

client.query('SELECT NOW()', (err, res) => {
    console.log(err, res);
    client.end();
})

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.get('/', function(req, res) {
    
});

app.use('/api', router)

app.listen(port);
console.log('Server has been started on port ' + port);