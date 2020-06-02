import { Request, Response } from "express";
import knex from "../database/connection";

class ItemsController {
  constructor() {}

  async index(request: Request, response: Response) {
    const items = await knex("item").select("*");

    const serializedItems = items.map((item) => {
      return {
        id: item.id,
        title: item.title,
        image_url: process.env.IMG_BASE_URL + item.image,
      };
    });

    return response.json(serializedItems);
  }
}

export default ItemsController;
