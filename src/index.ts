import { ParseService } from '@owsas/parse-service';
import { ParseQueryGen, IParams } from 'parse-query-gen';

export interface ISearchConfig {
  [key:string]: { 
    search: string;
    include?: string[];
    select?: string[];
    imgKey?: string;
    textKey: string;
  };
}

export interface IGetResultsForQueryOptions {
  scope: string[];
  limit?: number;
  queryOptions?: Parse.Query.FindOptions;
  format?: boolean;
  filters?: {
    [key:string]: IParams,
  };
}

export interface IResult {
  text: string;
  img?: string;
  objectId: string;
  className: string;
}

export interface IGetSearchQueryOptions {
  className: string; 
  key: string;
  limit?: number;
}

export class ParseTextSearch {
  static CONFIG: ISearchConfig = {};
  static parse;
  static defaultLimit: number = 10;

  /**
   * An object in which each key is a className,
   * and each value is a string, or an array of strings, with
   * the keys that are going to be matched
   * @param keyValues
   * @example
   * const config = {
        _User: {
          search: ['name', 'email'],
          include: [''],
          select: ['name', 'pic'],
          textKey: 'name',
          imgKey: 'pic',
        },
        Other: {
          search: 'name',
        },
      };
   */
  static configure(keyValues: ISearchConfig) {
    ParseTextSearch.CONFIG = keyValues;
  }

  /**
   * Gets the results for a text search, in the given scope
   * You MUST configure the class before calling this
   * @param text
   * @param params
   */
  static async search(
    text: string, 
    params: IGetResultsForQueryOptions,
  ): Promise<Parse.Object[]|IResult[]> {
    const promises = [];

    params.scope.forEach((className) => {
      // run only if the className was configured
      if (ParseTextSearch.CONFIG[className]) {
        const keys = ParseTextSearch.CONFIG[className].search;
        const { select } = ParseTextSearch.CONFIG[className];
        const queries: Parse.Query[] = [];

        keys.split(',').forEach((key: string) => {
          const query = ParseTextSearch.getSearchQuery(
            text,
            { className, key, limit: params.limit },
          );
          queries.push(query);
        });

        // redo the select
        const orQuery: Parse.Query = ParseTextSearch.parse.Query.or(...queries);
        if (select) {
          orQuery.select(...select);
        }

        // run the filters
        if (params.filters && params.filters[className]) {
          ParseQueryGen.gen({
            query: orQuery,
            ...params.filters[className],
          });
        }

        // find the results
        promises.push(ParseService.find(orQuery, params.queryOptions));
      }
    });

    const results: any[] = await ParseTextSearch.parse.Promise.when(promises);
    let realResults: Parse.Object[] = [];
    results.forEach((r) => {
      realResults = realResults.concat(r);
    });

    if (params.format) {
      const formatted: IResult[] = realResults.map((result) => {
        const config = ParseTextSearch.CONFIG[result.className];
        return config && {
          objectId: result.id,
          className: result.className,
          text: result.get(config.textKey),
          img: config.imgKey && result.get(config.imgKey),
        };
      }).filter(Boolean);

      return formatted;
    }

    return realResults;
  }

  /**
   * Gets a query for the text, given the options
   * Please configure the class before using this
   * @param text
   * @param options
   */
  static getSearchQuery(text: string, options: IGetSearchQueryOptions): Parse.Query {
    if (!ParseTextSearch.CONFIG[options.className]) {
      throw new Error(`Please configure ${options.className} before`);
    }

    const { select, include } = ParseTextSearch.CONFIG[options.className];

    const query = new ParseTextSearch.parse.Query(options.className);

    // run the regexp
    query.matches(options.key, new RegExp(text, 'ig'));
    query.limit(options.limit || ParseTextSearch.defaultLimit);

    if (include) {
      query.include(include);
    }

    query.select(select || [options.key]);

    return query;
  }
}
