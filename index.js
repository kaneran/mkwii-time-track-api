const express = require("express");
const timesRoute = require("./routes/times");
const pool = require("./database");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/times", timesRoute);

app.get("/tracks", async (req, res) => {
  const results = await pool.query(`
  select t.track_id, t.name, t.has_shortcut ,count(tt) as track_time_count 
  from track t left join track_time tt on t.track_id = tt.track_id 
  group by tt.track_id, t.track_id 
  order by t.track_id`);
  res.send(
    results.rows.map((row) => ({
      id: parseInt(row.track_id),
      name: row.name,
      has_shortcut: row.has_shortcut,
      track_time_count: parseInt(row.track_time_count)
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
