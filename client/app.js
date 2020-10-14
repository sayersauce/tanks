const express = require("express");
const app = express();

app.use("/res", express.static("res"));
app.use("/tanks", express.static("tanks"));
app.use(express.static("public"));

app.listen(80);
