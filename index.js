const express = require("express");
const timesRoute = require("./routes/times");
const pool = require("./database");
const app = express();

app.use(express.json());
app.use("/times", timesRoute);

app.get("/tracks", async (req, res) => {
  const results = await pool.query("select * from track");
  res.send(results.rows);
});

app.listen(3000);
