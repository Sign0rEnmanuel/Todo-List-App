import express from "express";
import cors from "cors";
import colors from "colors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello World!"
    })
})

app.listen(port, () => {
    console.log(colors.green("======================================================================"));
    console.log(colors.green(`Server running on port ${port}`));
    console.log(colors.green(`API available at http://localhost:${port}`));
    console.log(colors.green("======================================================================"));
})