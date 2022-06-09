import pg from "pg";

const {Pool} = pg;
const db = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: process.env.PASS, // nao fica assim em um projeto de verdade
  database: "shortly"
});

export default db;
