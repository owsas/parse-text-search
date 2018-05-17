import * as Parse from 'parse/node';
import { ParseTextSearch } from '../src/index';

// configure text search
ParseTextSearch.Parse = Parse;
ParseTextSearch.configure({
  _User: {
    search: ['name', 'email'],
    select: ['name'],
    textKey: 'name',
  },
});


