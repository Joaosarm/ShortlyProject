import { Router } from "express";
import { shortenUrl } from "../controllers/urlsController.js";
import { validateToken, validateUrl } from "../middlewares/userMiddleware.js";


const urlsRouter = Router();

urlsRouter.post("/urls/shorten",validateToken, validateUrl, shortenUrl);
urlsRouter.post("/urls/:id", shortenUrl);


export default urlsRouter;