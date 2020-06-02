import * as dotenv from "dotenv";
import path from "path";

dotenv.config();

module.exports = {
  client: "pg",
  connection: process.env.PG_CONNECTION_STRING,
  migrations: {
    directory: path.resolve(__dirname, "src", "database", "migrations"),
  },
  seeds: {
    directory: path.resolve(__dirname, "src", "database", "seeds"),
  },
};
