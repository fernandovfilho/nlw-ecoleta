import { Request, Response } from "express";
import knex from "../database/connection";

class PointsController {
  constructor() {}

  async create(request: Request, response: Response) {
    const {
      image = "https://images.unsplash.com/photo-1589631865989-6174b3a679f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;

    const point = {
      image,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    const trx = await knex.transaction();

    try {
      const insertedIds = await trx("point").returning("id").insert(point);

      const point_id = insertedIds[0];

      const serializedItems = items.map((item_id: number) => {
        return {
          item_id,
          point_id,
        };
      });

      await trx("point_items").insert(serializedItems);

      await trx.commit();

      return response.json({ id: point_id, ...point });
    } catch (error) {
      trx.rollback();
      return response.status(500).json({ error });
    }
  }

  async show(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const point = await knex("point").where("id", id).first();

      if (!point) throw "Point not found";

      const items = await knex("item")
        .join("point_items", "item.id", "=", "point_items.item_id")
        .where("point_items.point_id", id)
        .select("item.title");

      return response.json({ point, items });
    } catch (error) {
      return response.status(400).json({ error });
    }
  }

  async index(request: Request, response: Response) {
    try {
      const { city, uf, items } = request.query;

      const parsedItems: number[] = String(items)
        .split(",")
        .map((item: string) => Number(item.trim()));

      let query = knex("point");

      if (city) query.where("city", String(city));

      if (uf) query.where("uf", String(uf));

      query
        .whereIn("point_items.item_id", parsedItems)
        .join("point_items", "point.id", "=", "point_items.point_id")
        .distinct()
        .select("point.*");

      const points = await query;

      return response.json(points);
    } catch (error) {
      return response.status(400).json({ error });
    }
  }
}

export default PointsController;
