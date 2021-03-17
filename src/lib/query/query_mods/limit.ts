import { GeneralQueryMod } from "../../../types";

export function limit(limit: number): GeneralQueryMod {
  return {
    type: "general",
    toString(): string {
      return `LIMIT ${limit}`;
    }
  };
}
