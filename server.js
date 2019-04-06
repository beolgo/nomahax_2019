const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

const mysql = require('mysql');
const conn = mysql.createConnection({
	host : "localhost",
	user : "root",
	password : "cheese88",
	database : "NomaHacks"
});

conn.connect();

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});