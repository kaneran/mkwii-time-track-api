const pool = require("../database");

const insertTimeQuery = {
  text: "INSERT INTO track_time(track_id, time, format, date_achieved) VALUES ($1, $2, $3, $4)",
  values: [],
};

const insertTimeBreakdownQuery =
  "INSERT INTO time_shortcut_breakdown(shortcut_id, track_time_id, lap_count, shortcut_achieved) VALUES ($1, $2, $3, $4)";

const selectTimeQuery = {
  text: "SELECT * FROM track_time where time = $1 and track_id = $2",
  values: [],
};

const selectTimesQuery = {
  text: "SELECT track_time_id, time, format, date_achieved FROM track_time where track_id = $1",
  values: [],
};

const createTime = async (req) => {
  const { track_id, time, format, date_achieved } = req.body;
  insertTimeQuery.values = [track_id, time, format, date_achieved];
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

const getTimesForTrack = async (track_id) => {
  selectTimesQuery.values = [track_id];
  const result = await pool.query(selectTimesQuery);
  console.log(result);
  return result.rows;
};

module.exports = { createTime, getTimesForTrack };
