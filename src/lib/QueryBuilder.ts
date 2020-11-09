export type QueryMeta = {
  table: string;
  statementType: string;
  columns?: string[];
  parameters?: unknown[];
  filter?: QueryMetaFilter;
};

export enum SQLStatementType {
  CREATE = "CREATE",
  SELECT = "SELECT",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  COUNT = "COUNT",
}

type QueryMetaFilter = {
  limit?: number;
  offset?: number;
  order?: QueryMetaFilterOrder;
  where?: QueryMetaFilterWhere;
};

type QueryMetaFilterOrder = {
  columns: string[];
  direction: string;
};

export enum OrderDirection {
  ASC = "ASC",
  DESC = "DESC"
}

type QueryMetaFilterWhere = {
  query: string;
  parameters: unknown[];
};

export class QueryBuilder {
  /**
   * Takes all query meta information and uses that to form a finalized SQL query.
   */
  public build({ table, statementType, columns, parameters, filter }: QueryMeta): string {
    switch (statementType) {
      case SQLStatementType.CREATE:
        return this.makeInsertQuery(table, columns, parameters);
      case SQLStatementType.SELECT:
        return this.makeSelectQuery(table, columns, filter);
      case SQLStatementType.UPDATE:
        return this.makeUpdateQuery(table, columns, parameters, filter ? filter.where : null);
      case SQLStatementType.DELETE:
        return this.makeDeleteQuery(table, filter ? filter.where : null);
      case SQLStatementType.COUNT:
        return this.makeCountQuery(table, filter ? filter.where : null);
      default:
        throw new Error(`QB_ERROR::INVALID_QUERY_TYPE "${statementType}"`);
    }
  }

  private makeInsertQuery(table: string, columns: string[], parameters: unknown[]): string {
    return `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${QueryBuilder.convertParameters(parameters).join(", ")});`;
  }

  private makeSelectQuery(table: string, columns: string[], filter?: QueryMetaFilter): string {
    const selectAll = columns.length === 0;

    let query = `SELECT ${selectAll ? "*" : columns.join(", ")} FROM ${table}`;

    // Add a WHERE clause to the query first
    if (filter != null && filter.where) {
      query += ` WHERE ${filter.where.query}`;
      query = QueryBuilder.replacePlaceholders(query, QueryBuilder.convertParameters(filter.where.parameters));
    }

    // Handle an ORDER BY clause next if it is present in the filter
    if (filter != null && filter.order) {
      if (filter.order.direction.toUpperCase() !== OrderDirection.ASC && filter.order.direction.toUpperCase() !== OrderDirection.DESC) {
        throw new Error(`QB_ERROR::INVALID_ORDER_BY_DIRECTION "${filter.order.direction.toUpperCase()}"`);
      }
      query += ` ORDER BY ${filter.order.columns.join(", ")} ${filter.order.direction.toUpperCase()}`;
    }

    // Add in limit and offset clauses if they are present in the filter
    if (filter != null) {
      query += `${filter.limit ? ` LIMIT ${filter.limit}` : ""}${filter.offset ? ` OFFSET ${filter.offset}` : ""}`;
    }

    return `${query};`;
  }

  private makeUpdateQuery(table: string, columns: string[], parameters: unknown[], where?: QueryMetaFilterWhere): string {
    if (where) {
      const queryParams = QueryBuilder.convertParameters(parameters.concat(where.parameters));
      const updateParams = this.buildUpdateParameters(columns, queryParams.slice(0, parameters.length));
      const query = `UPDATE ${table} SET ${updateParams} WHERE ${where.query};`;
      return QueryBuilder.replacePlaceholders(query, queryParams.slice(parameters.length));
    }
    const updateParams = this.buildUpdateParameters(columns, QueryBuilder.convertParameters(parameters));
    return `UPDATE ${table} SET ${updateParams};`;
  }

  private buildUpdateParameters(columns: string[], parameters: unknown[]): string {
    const query: string[] = [];

    columns.forEach((c, i) => {
      query.push(`${c} = ${parameters[i]}`);
    });

    return query.join(", ");
  }

  private makeDeleteQuery(table: string, where?: QueryMetaFilterWhere): string {
    if (where) {
      const query = `DELETE FROM ${table} WHERE ${where.query};`;
      return QueryBuilder.replacePlaceholders(query, QueryBuilder.convertParameters(where.parameters));
    }

    return `DELETE FROM ${table};`;
  }

  private makeCountQuery(table: string, where?: QueryMetaFilterWhere): string {
    if (where) {
      const query = `SELECT COUNT(*) FROM ${table} WHERE ${where.query};`;
      return QueryBuilder.replacePlaceholders(query, QueryBuilder.convertParameters(where.parameters));
    }

    return `SELECT COUNT(*) FROM ${table};`;
  }

  private static replacePlaceholders(query: string, replacements: string[]): string {
    return query.replace(/\?/gi, () => replacements.shift());
  }

  private static convertParameters(parameters: unknown[]): string[] {
    return [...parameters.keys()].map(i => `$${i + 1}`);
  }
}
