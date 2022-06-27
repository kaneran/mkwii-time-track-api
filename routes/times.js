const app = require('express');
const timesController = require('../controllers/timesController');
const router = app.Router();

router.post('/add', async (req, res) => {
  const response = await timesController.createTime(req, res);
});

router.put('/delete/:timeId', async (req, res) => {
  await timesController.deleteTime(true, req, res);
});

router.put('/undo/:timeId', async (req, res) => {
  await timesController.deleteTime(false, req, res);
})

router.get('', async (req, res) => {
  const response = await timesController.getTimes();
  const trackTimes = await timesController.getTimesWithBreakdown(response);
  res.send(trackTimes);
});

router.get('/:timeId', async (req, res) => {
  const { timeId } = req.params;
  const response = await timesController.getTimes(timeId);
  const trackTimes = await timesController.getTimesWithBreakdown(response);
  res.send(trackTimes);
});

router.get('/track/:trackId', async (req, res) => {
  const { trackId } = req.params;
  const response = await timesController.getTimesForTrack(trackId);
  const trackTimes = await timesController.getTimesWithBreakdown(response);
  res.send(trackTimes);
});

module.exports = router;
