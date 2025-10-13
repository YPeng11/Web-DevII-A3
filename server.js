/*
 * @Author: YPeng11 161717186+YPeng11@users.noreply.github.com
 * @Date: 2025-09-29 21:35:05
 * @LastEditors: YPeng11 161717186+YPeng11@users.noreply.github.com
 * @LastEditTime: 2025-09-30 10:44:33
 * @FilePath: \Web-DevII-A2\server.js
 */
const express = require('express');
const app = express();
const eventAPI = require("./API/api-controller");

const cors = require("cors");

app.use(cors())

app.use("/api/events", eventAPI);
app.listen(3060);

console.log("Server up and running on port 3060");

