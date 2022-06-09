import { Router } from "express";
import { deleteUrl, getUrl, openUrl, shortenUrl } from "../controllers/urlsController.js";
import { validateToken, validateUrl } from "../middlewares/urlsMiddleware.js";


const urlsRouter = Router();

urlsRouter.post("/urls/shorten",validateToken, validateUrl, shortenUrl);
urlsRouter.get("/urls/:id", getUrl);
urlsRouter.get("/urls/open/:shortUrl", openUrl);
urlsRouter.delete("/urls/:id", validateToken, deleteUrl);


export default urlsRouter;