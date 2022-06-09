import db from "../../database.js";
import { nanoid } from "nanoid";


// Função de Criação de Usuário ------ Recebendo nome, email e senha
export async function shortenUrl(req, res) {
    const { user } = res.locals;
    const { url } = req.body;

    try {
        const urlId = nanoid(6);

        const urlObject = {
            shortUrl: urlId
        };

        await db.query(`
            INSERT INTO "shortenedUrls" (url, "shortUrl", "userId") 
            VALUES ($1, $2, $3)
        `, [url,urlId,user.id]);

        res.status(201).send(urlObject);
        
    } catch (e) {
        console.log("Erro na criação do codigo do link!\n", e);
        return res.sendStatus(500);
    }
}

export async function getUrl(req, res) {
    const { id } = req.params;

    try {
        const result = await db.query(`SELECT id, "shortUrl", url FROM "shortenedUrls" WHERE id=$1`, [id]);
        if (result.rowCount === 0) return res.sendStatus(404);

        res.send(result.rows[0]);
        
    } catch (e) {
        console.log("Erro no resgate do link encurtado!\n", e);
        return res.sendStatus(500);
    }
}