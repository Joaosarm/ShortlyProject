import { Router } from "express";
import { getUrl, openUrl, shortenUrl } from "../controllers/urlsController.js";
import { validateToken, validateUrl } from "../middlewares/userMiddleware.js";


const urlsRouter = Router();

urlsRouter.post("/urls/shorten",validateToken, validateUrl, shortenUrl);
urlsRouter.get("/urls/:id", getUrl);
urlsRouter.get("/urls/open/:shortUrl", openUrl);


export default urlsRouter;