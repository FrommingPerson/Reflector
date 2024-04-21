const express = require('express'); 
const auth = express(); 
const bcrypt = require('bcrypt');
const cors = require('cors');
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database('./db/sql3.db');

auth.use(express.json());

var corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

auth.use(cors(corsOptions));

console.log("Auth is working");

auth.post(`/login`, cors(corsOptions), (req, res) => {
    let pass = req.body.password;
    pass.split(1);
    const salt = bcrypt.genSaltSync(10);
    const cryptedPassword = bcrypt.hashSync(pass, salt);
    console.log(cryptedPassword);
    // let sql = `SELECT Id, FirstName, LastName, Login, Password, Role FROM Users WHERE Password='${cryptedPassword}'`;
    let sql = `SELECT Id, FirstName, LastName, Login, Password, Role FROM Users WHERE Login='${req.body.login}'`;
    db.all(sql, [], (err, rows) => {
        if (err) {
        throw err;
        }
        else {
        res.send(rows);
        console.log(rows);
        }
    });
})

module.exports = auth;