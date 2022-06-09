import express, {json} from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./src/routes/authRouter.js";
import urlsRouter from "./src/routes/urlsRouter.js";
import usersRouter from "./src/routes/usersRouter.js";

const app = express();
app.use(cors());
app.use(json());
dotenv.config();

// routes
app.use(authRouter);
app.use(urlsRouter);
app.use(usersRouter);

app.listen(process.env.PORT, () => {
    console.log("Server running on port " + process.env.PORT);
});