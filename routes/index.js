const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/s/:phone", function (req, res, next) {
  const name = req.params.phone;
  const q = req.query.q;
  res.status(200).json({
    name: name,
    q: q,
  });
});

module.exports = router;
