import { WhereQueryMod } from "../../../types";

export default function buildWhereQuery(whereMods: WhereQueryMod[]): string {
  if (whereMods.length === 0) {
    return "";
  }

  return whereMods.reduce((acc, mod, idx) => {
    if (idx === 0) {
      return `WHERE ${mod.toString()}`;
    } else {
      return `${acc} ${mod.and ? "AND" : "OR"} ${mod.toString()}`;
    }
  }, "");
}
