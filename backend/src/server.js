import express from "express";
import cors from "cors";
import colors from "colors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Server is running",
    });
});

app.listen(port, () => {
    console.log(colors.green("===================================================================="));
    console.log(colors.green("===================================================================="));
    console.log(colors.green("The server is running in" + colors.cyan(` http://localhost:${port} `)));
    console.log(colors.green("===================================================================="));
    console.log(colors.green("===================================================================="));
})