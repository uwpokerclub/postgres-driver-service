import { GeneralQueryMod, QueryMod, WhereQueryMod } from "../../../types";

export default function buildSelectQuery(tableName: string, queryMods: QueryMod[], columns?: string[]): string {
  // Build the base select clause
  const columnString = columns != null || columns.length !== 0 ? columns.join(", ") : "*";
  const baseQuery = `SELECT ${columnString} FROM ${tableName}`;

  // Build a valid where clause with query mods
  const whereMods = queryMods.filter((q) => q.type === "where") as WhereQueryMod[];

  // Build an order by clause
  const orderByMods = queryMods.filter((q) => q.type === "order") as GeneralQueryMod[];

  // Build the rest of the query
  const otherMods = queryMods.filter((q) => q.type === "general");

  return "";
}
