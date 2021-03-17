import { GeneralQueryMod } from "../../../types";

export function offset(offset: number): GeneralQueryMod {
  return {
    type: "general",
    toString(): string {
      return `OFFSET ${offset}`;
    }
  };
}
