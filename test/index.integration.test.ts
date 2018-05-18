import * as dotenv from 'dotenv';
dotenv.config();

import * as Parse from 'parse/node';
import { ParseTextSearch, ISearchConfig, IResult } from '../src/index';
import { ParseService } from '@owsas/parse-service';


(Parse as any).serverURL = process.env.SERVER_URL;
Parse.initialize(process.env.APP_ID, process.env.JS_KEY);

// configure text search
ParseTextSearch.parse = Parse;
const CONFIGURATION: ISearchConfig = {
  _User: {
    search: 'name,email',
    select: ['name', 'username'],
    textKey: 'name',
  },
};

ParseTextSearch.configure(CONFIGURATION);

test('should be able to find the results', async () => {
  const results: Parse.Object[]|IResult[] = await ParseTextSearch.search('juan', {
    scope: ['_User'],
  });

  expect(results.length).toBeGreaterThan(0);
  expect(results[0] instanceof Parse.Object).toBe(true);
});

test('should be able to find the results with additional filters', async () => {
  const results: Parse.Object[]|IResult[] = await ParseTextSearch.search('juan', {
    scope: ['_User'],
    filters: {
      _User: {
        matches: {
          email: 'gmail',
        },
      },
    },
  });

  expect(results.length).toBeGreaterThan(0);
  expect(results[0] instanceof Parse.Object).toBe(true);
});

