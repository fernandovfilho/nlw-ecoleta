import * as dotenv from "dotenv";
import express from "express";
import path from "path";
import routes from "./routes";
dotenv.config();

const app = express();

app.use(express.json());

app.use(routes);

app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

app.listen(process.env.PORT, () => {
  console.log("App listen at: ", process.env.PORT);
});
