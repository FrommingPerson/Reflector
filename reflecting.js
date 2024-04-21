const express = require("express");
const cors = require('cors');
const app = express();
const registration = require('./registration.js');
const auth = require('./auth.js');

const sqlite3 = require("sqlite3");
const db = new sqlite3.Database('./db/sql3.db');
const PORT = 3000;

app.use(express.json());

var corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));

app.get('/', cors(corsOptions), (req, res) => {
    let sql = `SELECT Id id, Title title, Description description, Status status, Necessity necessity, Date date FROM Requests`;
db.all(sql, [], (err, rows) => {
if (err) {
throw err;
}
// rows.forEach((row) => {
// res.send(row.title);
// });
res.send(rows);
console.log(rows);
});
});

app.post('/requests', cors(corsOptions),(req, res) => {
    let title = req.body.title;
    let description = req.body.description;
    let date = req.body.date;
    let status = req.body.status;
    let necessity = req.body.necessity;
    db.run(
        `INSERT INTO Requests(Title, Description, Date, Status, Necessity) VALUES( 
        '${title}', '${description}', '${date}', '${status}', '${necessity}')`,
        (err, row) => {
        if (err) throw err;
        // res.redirect(303, '/success');
        console.log(err);
        }
        );
    console.log(req.body);
  });

  app.delete(`/request/:id`, cors(corsOptions), (req, res) => {
    let id = req.params.id;
    id = id.slice(1);
    db.run(`DELETE FROM Requests WHERE Id=${id}`, function(err) {
        console.log("Deleting by id " + id);
        if(err){
            console.log(err)
        }
        else{
            console.log("Successful");
        }
        // sqlDB.close();
    });
  })

  app.put(`/updateReq/:id`, cors(corsOptions), (req, res) => {
    let id = req.params.id;
    id = id.slice(1);
    db.run(`UPDATE Requests
        SET Title = '${req.body.title}',
            Description = '${req.body.description}',
            Date = '${req.body.date}',
            Status = '${req.body.status}',
            Necessity = '${req.body.necessity}' 
        WHERE Id=${id}`, function(err) {
        console.log("Updating by id " + id);
        if (err) {
          console.log(err);
        }
    })
  })

app.listen(PORT, () => {
    console.log(`App's listening on port ${PORT}`);
    console.log(db);
});

app.use(registration);
app.use(auth);
