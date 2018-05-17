import { ParseService } from '@owsas/parse-service';

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
  static async getResultsForSearch(
    text: string, 
    params: IGetResultsForQueryOptions,
  ): Parse.Promise<Parse.Object[]> {
    const promises = [];

    params.scope.forEach((className) => {
      // run only if the className was configured
      if (ParseTextSearch.CONFIG[className]) {
        const keys = ParseTextSearch.CONFIG[className].search;
        keys.split(',').forEach((key: string) => {
          const query = ParseTextSearch.getSearchQuery(
            text,
            { className, key, limit: params.limit },
          );

          promises.push(ParseService.find(query, params.queryOptions));
        });
      }
    });

    const results: any[] = await ParseTextSearch.parse.Promise.when(promises);
    /* const realResults = [];
    results.forEach((r) => {
      console.log(r);
      realResults.concat(r);
    }); */

    return results;
  }

  /**
   * Gets a query for the text, given the options
   * Please configure the class before using this
   * @param text
   * @param options
   */
  static getSearchQuery(text: string, options: IGetSearchQueryOptions): Parse.Query {
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
