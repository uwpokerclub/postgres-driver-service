import { GeneralQueryMod } from "../../../types";

export default function offset(offset: number): GeneralQueryMod {
  return {
    type: "general",
    toString(): string {
      return `OFFSET ${offset}`;
    }
  };
}
