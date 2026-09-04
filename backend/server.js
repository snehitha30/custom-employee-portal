require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/auth");
const appsRoutes = require("./src/routes/apps");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Employee Portal Backend is running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/apps", appsRoutes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});