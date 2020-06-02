import * as dotenv from "dotenv";
import knex from "knex";

dotenv.config();

const connection = knex({
  client: "pg",
  connection: process.env.PG_CONNECTION_STRING,
});

export default connection;
