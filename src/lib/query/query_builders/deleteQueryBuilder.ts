import { buildWhereQuery } from ".";
import { QueryMod, WhereQueryMod } from "../../../types";

export default function buildDeleteQuery(tableName: string, queryMods: QueryMod[]): string {
  const baseQuery = `DELETE FROM ${tableName}`;

  // Build a valid where clause with query mods.
  const whereMods = queryMods.filter((q) => q.type === "where") as WhereQueryMod[];
  const whereQuery = buildWhereQuery(whereMods);

  return `${baseQuery} ${whereQuery}`.replace(/\s+/gi, () => " ").trim() + ";";
}
