import { buildOrderBy, buildWhereQuery } from ".";
import { GeneralQueryMod, QueryMod, WhereQueryMod } from "../../../types";

export default function buildSelectQuery(tableName: string, queryMods: QueryMod[], columns?: string[]): string {
  // Build the base select clause.
  const columnString = columns != undefined && columns.length !== 0 ? columns.join(", ") : "*";
  const baseQuery = `SELECT ${columnString} FROM ${tableName}`;

  // Build a valid where clause with query mods.
  const whereMods = queryMods.filter((q) => q.type === "where") as WhereQueryMod[];
  const whereQuery = buildWhereQuery(whereMods);

  // Build an order by clause.
  const orderByMods = queryMods.filter((q) => q.type === "order") as GeneralQueryMod[];
  const orderByQuery = buildOrderBy(orderByMods);

  // Build the rest of the query.
  const otherMods = queryMods.filter((q) => q.type === "general");
  const restOfQuery = otherMods.map((q) => q.toString()).join(" ");

  return `${baseQuery} ${whereQuery} ${orderByQuery} ${restOfQuery}`.replace(/\s+/gi, () => " ").trim() + ";";
}
