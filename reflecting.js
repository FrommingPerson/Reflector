const express = require("express");
const cors = require('cors');
const app = express();
const sqlite3 = require("sqlite3");
const server = require("http").createServer(app);
const db = new sqlite3.Database('./db/sql3.db');
const PORT = 3000;

const registration = require('./registration.js');
const auth = require('./auth.js');
const log = require('./logEvents');

const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200
};
//
app.use(express.json());
app.use(express.static('public'));
app.use(cors(corsOptions));

app.get('/', cors(corsOptions), (req, res) => {
    db.all(`SELECT Id id, Title title, Description description, Status status, Necessity necessity, Date date, User user, Performer performer
    FROM Requests`, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.send(rows);
        console.log(rows);
        console.log("The requests were gotten successfully");
    });
});

app.post('/requests', cors(corsOptions), (req, res) => {
    let {title, description, date, status, necessity, user, performer, photo} = req.body;
    db.run(
        `INSERT INTO Requests(Title, Description, Date, Status, Necessity, User, Performer, Photo) VALUES( 
        '${registration.format(title)}', '${registration.format(description)}', '${date}', '${status}', '${necessity}', '${user}', '${performer}', '${photo}')`,
        (err, row) => {
            if (err) throw err;
            console.log(err);
        }
    );
    console.log(req.body);
});

app.delete(`/request/:id`, cors(corsOptions), (req, res) => {
    let id = req.params.id;
    id = id.slice(1);
    db.run(`DELETE FROM Requests WHERE Id=${id}`, function (err) {
        console.log("Deleting by id " + id);
        if (err) {
            console.log(err)
        } else {
            console.log("Successful deleting");
        }
    });
})

app.put(`/updateReq/:id`, cors(corsOptions), (req, res) => {
    let id = req.params.id;
    id = id.slice(1);
    console.log(req.body);
    let {title, description, date, status, necessity, performer} = req.body;
    db.run(`UPDATE Requests
        SET Title = '${registration.format(title)}',
            Description = '${registration.format(description)}',
            Date = '${date}',
            Status = '${status}',
            Necessity = '${necessity}',
            Performer = '${performer}'
        WHERE Id=${id}`, function (err) {
        console.log("Updating by id " + id);
        if (err) {
            console.log(err);
        }
    })
})

server.listen(PORT, () => {
    console.log(`App's listening on port ${PORT}`);
    console.log(db);
});

app.use(registration);
app.use(auth);
app.use(log);


