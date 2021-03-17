import { WhereQueryMod } from "../../../types";

export function where(expression: string, parameters: unknown[]): WhereQueryMod {
  return {
    type: "where",
    and: true,
    parameters,
    toString(): string {
      return expression;
    }
  };
}
