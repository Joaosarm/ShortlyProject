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
        `, [url, urlId, user.id]);

        res.status(201).send(urlObject);

    } catch (e) {
        console.log("Erro na criação do codigo do link!\n", e);
        return res.sendStatus(500);
    }
}


// Receber dados do link encurtado pelo id
export async function getUrl(req, res) {
    const { id } = req.params;

    try {
        const result = await db.query(`
        SELECT id, "shortUrl", url 
        FROM "shortenedUrls" 
        WHERE id=$1
        `, [id]); // Recebe id, codigo do link e link

        if (result.rowCount === 0) return res.sendStatus(404);

        res.status(200).send(result.rows[0]);

    } catch (e) {
        console.log("Erro no resgate de dados sobre o link encurtado!\n", e);
        return res.sendStatus(500);
    }
}


//Abre URL a partir do link encurtado
export async function openUrl(req, res) {
    const { shortUrl } = req.params;

    try {
        const result = await db.query(`
        SELECT url, "visitCount"
        FROM "shortenedUrls" 
        WHERE "shortUrl"=$1
        `, [shortUrl]); // Recebe url e quantidade que link foi clicada

        if (result.rowCount === 0) return res.sendStatus(404);

        await db.query(`
        UPDATE "shortenedUrls" 
        SET "visitCount"=$1 
        WHERE "shortUrl"=$2
        `, [result.rows[0].visitCount + 1, shortUrl]) // Atualiza a quantidade de vezes que link foi clicado

        res.status(200).redirect(result.rows[0].url);

    } catch (e) {
        console.log("Erro ao abrir link!\n", e);
        return res.sendStatus(500);
    }
}

// Deleta URL encurtada
export async function deleteUrl(req, res) {
    const { id } = req.params;
    const { user } = res.locals;

    try {
        const result = await db.query(`
        SELECT "userId" 
        FROM "shortenedUrls" 
        WHERE id=$1
        `, [id]); // Recebe o id do usuário que criou o link encurtado selecionado

        if (result.rowCount === 0) return res.sendStatus(404); // Checa a existencia do link encurtado
        if (result.rows[0].userId !== user.id) return res.sendStatus(401);// Checa se o usuario foi o que criou o link encurtado

        await db.query(`
        DELETE FROM "shortenedUrls" 
        WHERE id=$1
        `, [id]); // Deleta o link encurtado

        res.sendStatus(204);
    } catch (e) {
        console.log("Erro no deletar o link encurtado!\n", e);
        return res.sendStatus(500);
    }
}