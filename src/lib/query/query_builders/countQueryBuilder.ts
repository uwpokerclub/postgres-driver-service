import { buildWhereQuery } from ".";
import { QueryMod, WhereQueryMod } from "../../../types";

export default function buildCountQuery(tableName: string, queryMods: QueryMod[]): string {
  const baseQuery = `SELECT COUNT(*) FROM ${tableName}`;

  // Build a valid where clause with query mods.
  const whereMods = queryMods.filter((q) => q.type === "where") as WhereQueryMod[];
  const whereQuery = buildWhereQuery(whereMods);

  return `${baseQuery} ${whereQuery}`.replace(/\s+/gi, () => " ").trim() + ";";
}
