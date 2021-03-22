import { convertToParameters } from "./utils";

export default function buildInsertQuery(tableName: string, columns: string[], values: unknown[]): string {
  return `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${convertToParameters(values).join(", ")});`;
}
