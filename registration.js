const express = require('express'); 
const registration = express(); 
const bcrypt = require('bcrypt');
const cors = require('cors');
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database('./db/sql3.db');

registration.use(express.json());

var corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

registration.use(cors(corsOptions));

console.log("Registrtion is working");

registration.get(`/users`, cors(corsOptions),  (req, res) => {
    let sql = `SELECT Id id, FirstName firstName, LastName lastName, Login login, Password password FROM Users`;
    db.all(sql, [], (err, rows) => {
    if (err) {
    throw err;
    }
    res.send(rows);
    console.log(rows);
    });
})

registration.post(`/registration`, cors(corsOptions), (req, res) => {
    const password = req.body.password;
    const salt = bcrypt.genSaltSync(10);
    const cryptedPassword = bcrypt.hashSync(password, salt);
    db.run(
        `INSERT INTO Users(FirstName, LastName, Login, Password) VALUES( 
        '${req.body.firstName}', '${req.body.lastName}', '${req.body.login}', '${cryptedPassword}')`,
        (err) => {
        if (err) {
            console.log(err);
            res.send(false);
        }
        else {
            res.send(true);
        }
        }
        );
    console.log(`A password: ${password} and the crypted one: ${cryptedPassword}`);
})

// const password = "nagi";
//     const salt = bcrypt.genSaltSync(10);
//     const cryptedPassword = bcrypt.hashSync(password, salt);
//     console.log(`A password: ${password} and the crypted one: ${cryptedPassword}`);
module.exports = registration;