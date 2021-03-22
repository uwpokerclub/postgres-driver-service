import { GeneralQueryMod } from "../../../types";

export default function limit(limit: number): GeneralQueryMod {
  return {
    type: "general",
    toString(): string {
      return `LIMIT ${limit}`;
    }
  };
}
