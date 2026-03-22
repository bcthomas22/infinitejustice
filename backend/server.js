require("dotenv").config();

const express = require("express");
const cors = require("cors");
const getTopic = require("./routes/GetTopic");
const aiGenerate = require("./routes/AIGenerate");
const fetchLinks = require("./routes/FetchLinks");
const accessDB = require("./routes/AccessDB")


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