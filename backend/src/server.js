import express from "express";
import cors from "cors";
import colors from "colors";
import dotenv from "dotenv";
import { rateLimit } from "express-rate-limit";
import authRoute from "./routes/authRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again in 15 minutes",
    standardHeaders: true,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many try, please try again in 15 minutes",
    standardHeaders: true,
});

app.use(cors());
app.use(express.json());

app.use(globalLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/login", authLimiter);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello World!"
    })
})

app.use("/api/auth", authRoute);

app.listen(port, () => {
    console.log(colors.green("======================================================================"));
    console.log(colors.green(`Server running on port ${port}`));
    console.log(colors.green(`API available at http://localhost:${port}`));
    console.log(colors.green("======================================================================"));
})