import * as Parse from 'parse/node';
import { ParseTextSearch, ISearchConfig } from '../src/index';

// configure text search
ParseTextSearch.parse = Parse;
const CONFIGURATION: ISearchConfig = {
  _User: {
    search: 'name,email',
    select: ['name'],
    textKey: 'name',
  },
};

ParseTextSearch.configure(CONFIGURATION);

test('should configure correctly', () => {
  expect(ParseTextSearch.CONFIG).toEqual(CONFIGURATION);
});
