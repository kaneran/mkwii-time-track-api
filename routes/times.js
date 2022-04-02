const app = require("express");
const createTime = require("../controllers/timesController");
const router = app.Router();

router.post("/add", async (req, res) => {
  const response = await createTime(req, res);
  res.send(response);
});

router.get("/:trackId", (req, res) => {
  const { trackId } = req.params;
  console.log(trackId);
  res.send("Get times for track id " + trackId);
});

module.exports = router;
