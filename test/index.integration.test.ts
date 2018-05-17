import * as dotenv from 'dotenv';
import * as Parse from 'parse/node';
import { ParseTextSearch, ISearchConfig } from '../src/index';

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

