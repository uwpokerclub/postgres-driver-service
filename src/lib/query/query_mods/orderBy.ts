import { GeneralQueryMod, OrderByDirections } from "../../../types";

export default function orderBy(column: string, direction = "DESC" as OrderByDirections): GeneralQueryMod {
  return {
    type: "order",
    toString(): string {
      return `${column} ${direction}`;
    }
  };
}
