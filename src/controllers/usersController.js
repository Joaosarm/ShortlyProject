import db from "../../database.js";

//Resgata os urls do usuário
export async function getUserUrls(req, res) {
    const { id } = req.params;

    try {
        const user = await db.query(`
            SELECT u.id, u.name, SUM("visitCount") as "visitCount"
            FROM "shortenedUrls" s
            JOIN users u on s."userId"=u.id
            WHERE u.id=$1
            GROUP BY u.id
        `, [id]); // Pega o usuário do banco

        if (user.rowCount === 0) return res.sendStatus(404); // Checa se usuário existe

        const urls = await db.query(`
        SELECT id, "shortUrl", url, "visitCount"
        FROM "shortenedUrls" 
        WHERE "userId"=$1
        `, [id]); // Recebe id, codigo do link e link


        const userObject = {
            ...user.rows[0],
            shortenedUrls: urls.rows
        } // Constroi o objeto do usuario

        res.status(200).send(userObject);

    } catch (e) {
        console.log("Erro no resgate de dados do usuário!\n", e);
        return res.sendStatus(500);
    }
}


// Ranking dos usuários
export async function getRanking(req,res){
    try{
        const ranking = await db.query(`
            SELECT u.id, u.name, COUNT(s."userId") as "linksCount", SUM(s."visitCount") as "visitCount"
            FROM "shortenedUrls" s
            JOIN users u on s."userId"=u.id
            GROUP BY u.id
            ORDER BY "visitCount" DESC
            LIMIT 10
        `); // Recebe usuários com limite de 10 por ordem decrescente de visitas
        
        res.status(200).send(ranking.rows);

    } catch (e){
        console.log("Erro no resgate do ranking dos usuários!\n", e);
        return res.sendStatus(500);
    }
}