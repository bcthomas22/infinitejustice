require("dotenv").config();

const express = require("express");
const cors = require("cors");

console.log("Step 1")

const getTopic = require("./routes/GetTopic");
console.log("Step 2")

const aiGenerate = require("./routes/AIGenerate");
console.log("Step 3")

const fetchLinks = require("./routes/FetchLinks");
console.log("Step 4")

const accessDB = require("./routes/AccessDB")
console.log("Step 5")


const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use("/api/getTopic", getTopic);
app.use("/api/aiGenerate", aiGenerate.router);
app.use("/api/fetchLinks", fetchLinks);
app.use("/api/accessDB", accessDB);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});