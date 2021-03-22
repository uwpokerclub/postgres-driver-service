import { GeneralQueryMod } from "../../../types";

export default function buildOrderBy(queryMods: GeneralQueryMod[]): string {
  return queryMods.length !== 0 ? `ORDER BY ${queryMods.map((q) => q.toString()).join(", ")}` : "";
}
