console.log("legends always die");

const express = require("express");
const log = express();
const cors = require('cors');
const {format} = require("date-fns");
const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database('./db/sql3.db');
const {v4: uuid} = require("uuid");
console.log(uuid());

const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200
};
//
log.use(express.json());
log.use(cors(corsOptions));

console.log(format(new Date(), "yyyy MM dd : mm: ss"));
const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), "yyyy MM dd : mm: ss")}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    console.log(logItem);
    try {
        if (!fs.existsSync(path.join(__dirname, "logs"))) {
            await fsPromises.mkdir(path.join(__dirname, "logs"));
        }
        //testing
        await fsPromises.appendFile(path.join(__dirname, "logs", logName), logItem);
    } catch (err) {
        console.log(err);
    }
}

log.get('/cheque/:id', cors(corsOptions), (req, res) => {
    let id = req.params.id;
    id = id.slice(1);
    console.log(id);
    let sql = `SELECT Requests.Id id, Title title, Description description, Status status, Necessity necessity, Date date, Requests.User user, Performer performer, Users.FirstName firstName, Users.LastName lastName
FROM Requests INNER JOIN Users ON Requests.User = Users.Id WHERE Requests.Id=${id}`;
    db.all(sql, [], (err, row) => {
        if (row[0] === undefined) {
            console.log("There is no this request");
        } else {
            let {title, description, date, status, necessity, firstName, lastName, performer} = row[0];
            logEvents(`\n The title: ${title},\n The description: ${description},\n The date of ending: ${date},\n The status: ${status},\n Necessity: ${necessity},\n Who ordered: ${firstName} ${lastName},\n Who performed: ${performer}`,
                'chèque.txt').then(() => {
                let filePath = path.join(__dirname + '/logs/', 'chèque.txt');
                res.download(filePath);
                fsPromises.rm(__dirname + '/logs/chèque.txt').then(r => console.log(r));
            });
        }
    })
    console.log('The file was sent');
})

module.exports = log;
module.exports.logEvents = logEvents;
