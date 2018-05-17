import { ParseService } from '@owsas/parse-service';

export interface IParseReactSearchConfig {
  [key:string]: { 
    search: string|string[];
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
  static CONFIG: IParseReactSearchConfig = {};
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
  static configure(keyValues: IParseReactSearchConfig) {
    ParseTextSearch.CONFIG = keyValues;
  }

  /**
   * Gets the results for a text search, in the given scope
   * You MUST configure the class before calling this
   * @param text
   * @param params
   */
  static async getResultsForSearch(text: string, params: IGetResultsForQueryOptions) {
    const promises = [];

    params.scope.forEach((className) => {
      // run only if the className was configured
      if (ParseTextSearch.CONFIG[className]) {
        const keys = ParseTextSearch.CONFIG[className].search;

        // for string types
        if (typeof keys === 'string') {
          const query = ParseTextSearch.getSearchQuery(
            text,
            { className, limit: params.limit, key: keys },
          );

          promises.push(ParseService.find(query, params.queryOptions));

        // for array types
        } else {
          keys.forEach((key: string) => {
            const query = ParseTextSearch.getSearchQuery(
              text,
              { className, key, limit: params.limit },
            );

            promises.push(ParseService.find(query, params.queryOptions));
          });
        }
      }
    });

    return Parse.Promise.when(promises);
  }

  /**
   * Gets a query for the text, given the options
   * Please configure the class before using this
   * @param text
   * @param options
   */
  static getSearchQuery(text: string, options: IGetSearchQueryOptions): Parse.Query {
    const keys = ParseTextSearch.CONFIG[options.className].search;
    const { select, include } = ParseTextSearch.CONFIG[options.className];

    const query = new ParseTextSearch.parse.Query(options.className);

    // run the regexp
    query.matches(keys, new RegExp(text, 'ig'));
    query.limit(options.limit || ParseTextSearch.defaultLimit);

    if (include) {
      query.include(include);
    }

    query.select(select || [keys]);

    return query;
  }
}
