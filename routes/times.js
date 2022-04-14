const app = require("express");
const timesController = require("../controllers/timesController");
const router = app.Router();

router.post("/add", async (req, res) => {
  const response = await timesController.createTime(req);
  res.send(response);
});

router.get("/track/:trackId", async (req, res) => {
  const { trackId } = req.params;
  console.log(trackId);
  const response = await timesController.getTimesForTrack(trackId);
  res.send(response);
});

module.exports = router;
