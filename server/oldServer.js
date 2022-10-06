// this is only for reference
// requires
const express = require("express");
const app = express();
const cors = require("cors");
// env
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
// app
app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));
// get driver connection
const dbo = require("./db/conn");
 
// launch server
app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
 
  });
  console.log(`Server is running on port: ${port}`);
});