import * as dotenv from 'dotenv';
import * as Parse from 'parse/node';
import { ParseTextSearch, ISearchConfig } from '../src/index';
import { ParseService } from '@owsas/parse-service';

dotenv.config();

(Parse as any).serverURL = process.env.SERVER_URL;
Parse.initialize(process.env.APP_ID, process.env.JS_KEY);

// configure text search
ParseTextSearch.parse = Parse;
const CONFIGURATION: ISearchConfig = {
  _User: {
    search: ['name', 'email'],
    select: ['name'],
    textKey: 'name',
  },
};

ParseTextSearch.configure(CONFIGURATION);

ParseTextSearch.getResultsForSearch('serg', {
  scope: ['_User'],
}).then(console.log).catch(console.error);
