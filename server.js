const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const eventAPI = require("./API/api-controller");

const cors = require("cors");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors())

app.use("/api/", eventAPI);
app.listen(3060);

console.log("Server up and running on port 3060");

