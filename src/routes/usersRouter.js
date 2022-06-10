import { Router } from "express";
import { getRanking, getUserUrls } from "../controllers/usersController.js";
import { validateToken } from "../middlewares/urlsMiddleware.js";


const usersRouter = Router();

usersRouter.get("/users/:id", validateToken, getUserUrls);
usersRouter.get("/ranking", getRanking);

export default usersRouter;