const pool = require("../database");

const insertTimeQuery = {
  text: "INSERT INTO track_time(track_id, time, format) VALUES ($1, $2, $3)",
  values: [],
};

const insertTimeBreakdownQuery =
  "INSERT INTO time_shortcut_breakdown(shortcut_id, track_time_id, lap_count, shortcut_achieved) VALUES ($1, $2, $3, $4)";

const selectTimeQuery = {
  text: "SELECT * FROM track_time where time = $1 and track_id = $2",
  values: [],
};

const createTime = async (req, res) => {
  const { track_id, time, format } = req.body;
  insertTimeQuery.values = [track_id, time, format];
  await pool.query(insertTimeQuery);
  await createTimeBreakdown(req.body);
  return "Successfully added time!";
};

const createTimeBreakdown = async ({ track_id, time, breakdown }) => {
  selectTimeQuery.values = [time, track_id];
  const result = await pool.query(selectTimeQuery);
  const { track_time_id } = result.rows[0];

  breakdown.forEach((lap_breakdown) => {
    const { lap_count, shortcut_achieved, shortcut_id } = lap_breakdown;
    console.log(lap_count, shortcut_achieved, shortcut_id);
    const values = [shortcut_id, track_time_id, lap_count, shortcut_achieved];
    pool.query(insertTimeBreakdownQuery, values);
  });
};

module.exports = createTime;
