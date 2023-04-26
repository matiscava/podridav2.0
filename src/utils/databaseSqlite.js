import knex from "knex";
import options from "../config/config.js";

const db = knex(options.sqlite);

export default db;