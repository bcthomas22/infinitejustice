const express = require("express");
const cors = require("cors");
const doSomething = require("./routes/DoSomething");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.get("api/doSomething", doSomething);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});