const pool = require('../database');

const insertTimeQuery = {
  text: 'INSERT INTO track_time(track_id, time, format, date_achieved, deleted) VALUES ($1, $2, $3, $4, $5)',
  values: [],
};

const insertTimeBreakdownQuery = 'INSERT INTO time_shortcut_breakdown(shortcut_id, track_time_id, lap_count, shortcut_achieved) VALUES ($1, $2, $3, $4)';

const selectTimeQuery = {
  text: 'SELECT * FROM track_time where time = $1 and track_id = $2',
  values: [],
};

const selectTimeQuery2 = {
  text: 'SELECT * FROM track_time where track_time_id  = $1',
  values: [],
};

const selectTimesQuery = {
  text: 'SELECT track_time_id, track_id, time, format, date_achieved FROM track_time where track_id = $1 order by track_time_id',
  values: [],
};

const selectBreakdownQuery = {
  text: 'SELECT shortcut_id, track_time_id, lap_count, shortcut_achieved FROM time_shortcut_breakdown where track_time_id = $1 order by lap_count',
  values: [],
};

const updateTrackVisibilityQuery = {
  text: 'UPDATE track_time SET deleted = $1 WHERE track_time_id = $2',
  values: []
}

const createTime = async (req, res) => {
  const { track_id, time, format, date_achieved, deleted } = req.body;
  insertTimeQuery.values = [track_id, time, format, date_achieved, deleted];
  await pool.query(insertTimeQuery, (err, result) => {
    if (err) {
      res.send('Something went wrong!');
    } else if (result && req.body.breakdown) {
      createTimeBreakdown(req.body);
    }
  });
  return res.send('Successfully added time!');
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

const getTimes = async (timeId) => {
  if (timeId) {
    selectTimeQuery2.values = [timeId];
    const result = await pool.query(selectTimeQuery2);
    return result.rows;
  } else {
    const result = await pool.query('select track_time_id, track_id, time, format, date_achieved from track_time;');
    return result.rows;
  }
};

const getTimesForTrack = async (track_id) => {
  selectTimesQuery.values = [track_id];
  const result = await pool.query(selectTimesQuery);
  return result.rows;
};

const getBreakdown = async (track_time_id) => {
  selectBreakdownQuery.values = [track_time_id];
  const result = await pool.query(selectBreakdownQuery);
  return result.rows;
};

const getTimesWithBreakdown = async (track_times) => {
  const response = await Promise.all(
    track_times?.map(async (track_time) => {
      const breakdown = await getBreakdown(track_time.track_time_id);
      return { ...track_time, breakdown };
    })
  );
  return response;
};

const deleteTime = async (doDelete, req, res) => {
  const {timeId} = req.params;
  console.log(timeId);
  updateTrackVisibilityQuery.values = [doDelete, timeId];
  await pool.query(updateTrackVisibilityQuery);
  if(doDelete){
    res.send('Deleted time!');
  } else {
    res.send('Time undone!');
  }
  
}

module.exports = { createTime, getTimesForTrack, getBreakdown, getTimes, getTimesWithBreakdown, deleteTime };
