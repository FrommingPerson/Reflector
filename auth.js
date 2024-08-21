const express = require('express');
const auth = express();
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database('./db/sql3.db');
const registration = require('./registration.js');
const log = require('./logEvents');

const EventEmitter = require("events");

class MyEmitter extends EventEmitter {
}
//
const myEmitter = new MyEmitter();

myEmitter.on("log", (msg, fileName) => log.logEvents(msg, fileName));

auth.use(express.json());

const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200
};

auth.use(cors(corsOptions));

console.log("Auth is working");

auth.post(`/login`, cors(corsOptions), (req, res) => {
    let pass = req.body.password;
    console.log(`A written password by user: ${pass}`);
    let sql = `SELECT Id, FirstName, LastName, Login, Password, Role FROM Users WHERE Login='${registration.format(req.body.login)}'`;
    db.all(sql, [], async (err, rows) => {
        if (rows[0] === undefined){
            myEmitter.emit("log", `Login: ${req.body.login} \t "Status: Error"`, "authLog.txt");
            console.log("Something wrong with the response");
        }
        else {
        const isMatch = await bcrypt.compare(pass, registration.format(rows[0].Password));
        if (isMatch) {
            const token = jwt.sign({ role: rows[0].Role }, 'role', { expiresIn: '1h' });
            myEmitter.emit("log", `Login: ${req.body.login} \t "Status: Success"`, "authLog.txt");
            res.send(rows);
            console.log(rows);
        } else {
            console.log(`The user ${req.body.login} is not found by password: ${pass}`);
        }
        }
    });
})

module.exports = auth;