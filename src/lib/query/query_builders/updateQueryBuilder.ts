import { buildWhereQuery } from ".";
import { QueryMod, WhereQueryMod } from "../../../types";

export default function buildUpdateQuery(tableName: string, queryMods: QueryMod[], columns: string[]): string {
  if (columns.length === 0) {
    return "";
  }

  const baseQuery = `UPDATE ${tableName} SET`;

  // Build a valid where clause with query mods.
  const whereMods = queryMods.filter((q) => q.type === "where") as WhereQueryMod[];
  const whereQuery = buildWhereQuery(whereMods);

  // Build the SET portion of a query.
  const setQuery = columns.map((c) => `${c} = ?`).join(", ");

  return `${baseQuery} ${setQuery} ${whereQuery}`.replace(/\s+/gi, () => " ").trim() + ";";
}
