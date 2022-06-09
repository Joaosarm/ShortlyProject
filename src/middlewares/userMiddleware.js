import db from "../../database.js";
import joi from "joi";


//FUNÇÃO USADA EM TODAS AS ETAPAS DE NAVEGAÇAO DE PRODUTOS, PARA RESGATE DE USUÁRIO
export async function validateToken(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer", "").trim();
    if (!token) return res.status(401).send("Token não encontrado!"); // SEM HEADER COM TOKEN

    try {
        const user = await db.query(`
            SELECT users.id FROM sessions 
            JOIN users ON sessions."userId"=users.id
            WHERE sessions.token=$1
        `, [token]);
        if (user.rowCount===0) return res.status(401).send("Usuário não encontrado"); // NAO HÁ SESSÃO ATIVA PARA ESTE TOKEN

        res.locals.user = user.rows[0]; // GUARDA USUÁRIO PARA PRÓXIMA FUNCIONALIDADE
        
        next();

    } catch (e) {
        console.log("Erro ao tentar obter usuário\n", e);
        return res.sendStatus(500);
    }
}

export async function validateUrl(req, res, next){
    const body = req.body;

    const urlSchema = joi.object({ 
        url: joi.string().required().pattern(/^[(http(s)?):\/\/(www\.)]/)
    });

    const { error } = urlSchema.validate(body); // CHECA SE INFORMAÇÕES ESTAO CERTAS

    if (error) {
        return res.status(422).send(error); // DADOS NAO ESTÃO CONFORME REQUISITADO
    }

    next();
}