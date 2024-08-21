const express = require('express');
const registration = express();
const bcrypt = require('bcrypt');
const cors = require('cors');
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database('./db/sql3.db');

registration.use(express.json());

const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200
};

//
registration.use(cors(corsOptions));

console.log("Registration is working");

registration.get(`/users`, cors(corsOptions), (req, res) => {
    let sql = `SELECT Id id, FirstName firstName, LastName lastName, Login login, Password password, Role role FROM Users`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.send(rows);
        console.log(`The users from database: ${rows}`);
    });
})

registration.post(`/registration`, cors(corsOptions), (req, res) => {
    const password = req.body.password;
    const salt = bcrypt.genSaltSync(10);
    const encryptedPassword = bcrypt.hashSync(password, salt);
    console.log(req.body);
    db.run(
        `INSERT INTO Users(FirstName, LastName, Login, Password, Role) VALUES(
        '${format(req.body.firstName)}', '${format(req.body.lastName)}', '${format(req.body.login)}', '${encryptedPassword}', 'User')`,
        (err) => {
            if (err) {
                console.log(err);
                res.send(false);
            } else {
                console.log("Registration is successfully")
                res.send(true);
            }
        }
    );
    console.log(`A password: ${password} and the encrypted one: ${encryptedPassword}`);
})

registration.delete(`/deleteUser/:id`, cors(corsOptions), (req, res) => {
    let userId = req.params.id;
    let currentUser = req.body;
    console.log(currentUser);
    userId = userId.slice(1);
    db.run(`DELETE FROM Users WHERE Id=${userId}`, function (err) {
        if (err) {
            console.log(`Deleting the User by id: ${userId} isn't successFul`);
        } else {
            console.log(`Deleting the User by id: ${userId} is successFul`);
        }
    });
})

function format(argument) {
    argument = argument.replace("'", "`");
    console.log(`A data: ${argument}`);
    console.log(`Success formatting of the data: ${argument}`);
    return argument;
}

module.exports = registration;
module.exports.format = format;
