import { GeneralQueryMod, OrderByDirections } from "../../../types";

export function orderBy(column: string, direction = OrderByDirections.DESC): GeneralQueryMod {
  return {
    type: "order",
    toString(): string {
      return `${column} ${direction}`;
    }
  };
}
