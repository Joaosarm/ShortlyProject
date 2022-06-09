import { Router } from "express";
import { getRanking, getUserUrls } from "../controllers/usersController.js";


const usersRouter = Router();

usersRouter.get("/users/ranking", getRanking);
usersRouter.get("/users/:id", getUserUrls);

export default usersRouter;