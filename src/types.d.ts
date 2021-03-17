export type QueryModTypes = "where" | "general" | "order";

export enum OrderByDirections {
  ASC = "ASC",
  DESC = "DESC"
}

export interface GeneralQueryMod {
  type: QueryModTypes;
  toString(): string;
}

export interface WhereQueryMod extends GeneralQueryMod {
  and: boolean;
  parameters: unknown[]
}

export type QueryMod = GeneralQueryMod | WhereQueryMod;
