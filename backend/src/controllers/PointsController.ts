import { Request, Response } from "express";
import knex from "../database/connection";

class PointsController {
  constructor() {}

  async create(request: Request, response: Response) {
    const {
      image = "image-fake",
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
}

export default PointsController;
