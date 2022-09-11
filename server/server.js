const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const pg = require("pg");
require('dotenv').config();

//MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: "https://polling-unit-result.herokuapp.com" }));

app.use((req, res, next)=> {
    res.setHeader("Access-Control-Allow-Origin", "https://polling-unit-result.herokuapp.com");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
    next();
});
// TRACE ERROR
app.use((req, res, next) => {
    const render = res.render;
    const send = res.send;
    res.render = function renderWrapper(...args) {
        Error.captureStackTrace(this);
        return render.apply(this, args);
    };
    res.send = function sendWrapper(...args) {
        try {
            send.apply(this, args);
        } catch (err) {
            console.error(`Error in res.send | ${err.code} | ${err.message} | ${res.stack}`);
        }
    };
    next();
});

// DATABASE CONNECTION
const conString = process.env.PG_SQL_CONNECT
var client = new pg.Client(conString);
client.connect(async function (err) {
    if (err) {
        return console.error("could not connect to database", err);
    }
    console.log("Connected to database");
});


// ROUTES
app.post("/getIndividualpoll", (req, res)=>{
    const pollname = req.body.pollname;
    client.query(`select uniqueid, polling_unit_name from individualpollunitbyname('%${pollname}%')`).then(result => {
        return res.send({result : result.rows});
    }).catch(err => {
        return res.send({result : 0});
    })
});
app.post("/getIndividualpollresult", (req, res)=>{
    const pollid= req.body.pollid;
    client.query(`select * from individualpollunitresult(${pollid})`).then(result => {
        return res.send({result : result.rows});
    }).catch(err => {
        return res.send({result : 0});
    })
});
app.post("/getLga", (req, res)=>{
    client.query('select lga_id, lga_name from getAllLga()').then(result => {
        return res.send({result : result.rows});
    }).catch(err => {
        return res.send({result : 0});
    })
});
app.post("/getpollsumtotal", (req, res)=>{
    const lgaId = req.body.lgaid;
    client.query(`select uniqueid, polling_unit_name from getpollidfromlgaid(${lgaId})`).then(result => {
        const array = [];
        for(let i = 0; i < result.rowCount; i++){
            client.query(`select getpollscore(${result.rows[i].uniqueid})`).then(response => {
               const obj = {name: result.rows[i].polling_unit_name, score: (response.rows[0].getpollscore === null ) ? 0 : response.rows[0].getpollscore };
               array.push(obj);
               if(array.length === result.rowCount){
                return res.send({result : array});
               }
            })
        }
    }).catch(err => {
        return res.send({result : 0});
    })
});

app.post("/getPoll", (req, res)=>{
    client.query(`select polling_unit_name, uniqueid from allPoll()`).then(result => {
        return res.send({result : result.rows});
    }).catch(err => {
        return res.send({result : 0});
    })
});
app.post("/getParty", (req, res)=>{
    client.query(`select partyname from allParty()`).then(result => {
        return res.send({result : result.rows});
    }).catch(err => {
        return res.send({result : 0});
    })
});
app.post("/storeNewScore", (req, res)=>{
    const name = req.body.name;
    const selectParty = req.body.selectParty;
    const selectPoll = req.body.selectPoll;
    const number = req.body.number;
    console.log(name);
    console.log(number)
    console.log(selectPoll)
    console.log(selectParty)

    client.query(`call addNewPollScore('${name}', ${number}, ${selectPoll}, '${selectParty}')`).then(result => {
        return res.send({result : 1});
    }).catch(err => {
        console.log(err)
        return res.send({result : 0});
    })
});



// PORT
app.set("PORT", process.env.PORT || 5000);
app.listen(app.get("PORT"), ()=>{console.log("Server is running on localhost:", app.get("PORT"))});