const express = require("express");
const router = express.Router();

const strings = [
  "Apple",
  "Banana",
  "Orange",
  "Grape",
  "Pear",
  "Watermelon"
]

router.get("/", (req, res) => {
  const randomString = strings[Math.floor(Math.random() * strings.length)]
  res.json({value: randomString});
})

module.exports = router;