const express = require("express");
const timesRoute = require("./routes/times");
const pool = require("./database");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/times", timesRoute);

app.get("/tracks", async (req, res) => {
  const results = await pool.query("select * from track");
  res.send(
    results.rows.map((row) => ({
      id: parseInt(row.track_id),
      name: row.name,
      has_shortcut: row.has_shortcut,
    }))
  );
});

app.get("/shortcuts", async (req, res) => {
  const results = await pool.query("select * from shortcut");
  res.send(
    results.rows.map((row) => ({
      shortcut_id: parseInt(row.shortcut_id),
      track_id: parseInt(row.track_id),
      name: row.name,
    }))
  );
});

app.listen(3000);
