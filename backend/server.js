require("dotenv").config();

const express = require("express");
const cors = require("cors");
const doSomething = require("./routes/DoSomething");
const aiGenerate = require("./routes/AIGenerate");
const fetchLinks = require("./routes/FetchLinks");


const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use("/api/doSomething", doSomething);
app.use("/api/aiGenerate", aiGenerate);
app.use("/api/fetchLinks", fetchLinks);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});