import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

import db from "../../database.js";


// Função de Criação de Usuário ------ Recebendo nome, email e senha
export async function signUp(req, res) {
  const { password, name, email } = req.body;
  try {
    const passwordHash = bcrypt.hashSync(password, 10);

    await db.query(`
    INSERT INTO users (name, email, password) 
    VALUES ($1, $2, $3)
    `, [name, email, passwordHash]);


    return res.sendStatus(201); // created
  } catch (e) {
    console.log("Erro na criação do usuário!\n", e);
    return res.sendStatus(500);
  }
}


//Função de Login ---- Recebendo email e senha
export async function signIn(req, res) {
  const { email, password } = req.body;
  try {
    const user = await db.query(`SELECT * FROM users WHERE email=$1`, [email]);
    if (user.rowCount===0) return res.sendStatus(404); // USUARIO NAO ENCONTRADO - NOT FOUND

    if (user.rowCount>0 && bcrypt.compareSync(password, user.rows[0].password)) {
      const token = uuid();
      await db.query(`
        INSERT INTO sessions ("userId", token) 
        VALUES ($1, $2)
    `, [user.rows[0].id, token]);

      return res.send({ token }); // retorna token
    }

    return res.sendStatus(401); // SENHA ERRADA - NOT FOUND
  } catch (e) {
    console.log("Erro no login!\n", e);
    return res.sendStatus(500);
  }
}

export async function signOut(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer", "").trim();
  if (!token) return res.sendStatus(403); // NAO TEM TOKEN - FORBIDEN

  try {
    await db.query(`
    DELETE FROM sessions 
    WHERE token = $1
    `, [token]);
    
    res.sendStatus(200); //SUCESSO
  } catch (e) {
    console.log("Erro ao sair!\n", e);
    return res.sendStatus(500);
  }
}