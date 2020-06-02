import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("point_items", (table) => {
    table.increments("id").primary();
    table.integer("point_id").unsigned().notNullable();
    table.integer("item_id").unsigned().notNullable();

    table.foreign("point_id").references("id").inTable("point");
    table.foreign("item_id").references("id").inTable("item");
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("point_items");
}
