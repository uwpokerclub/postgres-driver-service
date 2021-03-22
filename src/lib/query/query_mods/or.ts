import { WhereQueryMod } from "../../../types";

export default function or(expression: string, parameters: unknown[]): WhereQueryMod {
  return {
    type: "where",
    and: false,
    parameters,
    toString(): string {
      return expression;
    }
  };
}
