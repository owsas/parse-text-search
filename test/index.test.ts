import * as Parse from 'parse/node';
import { ParseTextSearch, ISearchConfig, IResult } from '../src/index';
import { ParseService } from '@owsas/parse-service';

// configure text search
ParseTextSearch.parse = Parse;
const CONFIGURATION: ISearchConfig = {
  _User: {
    search: 'name,email',
    select: ['name', 'email'],
    imgKey: 'pic',
    textKey: 'name',
  },
  Country: {
    search: 'name',
    textKey: 'name',
    include: ['continent'],
  },
};

ParseTextSearch.configure(CONFIGURATION);

test('should configure correctly', () => {
  expect(ParseTextSearch.CONFIG).toEqual(CONFIGURATION);
});

describe('#search', () => {
  test('should find the results as Parse.Objects', async () => {
    const mockObj = new Parse.Object('Country');

    const mock = jest.spyOn(ParseService, 'find');
    mock.mockImplementation(async () => mockObj);

    const results = await ParseTextSearch.search('co', {
      scope: ['_User', 'Country', 'City', 'State'],
    });

    expect(results.length).toEqual(2);
    expect(results[0]).toBeInstanceOf(Parse.Object);
    expect(results[0].className).toEqual('Country');
    expect(results[1].className).toEqual('Country');
  });

  test('should find the results as IResult', async () => {
    const mockObj = new Parse.Object('_User');
    mockObj.set('name', 'juan camilo');

    const mock = jest.spyOn(ParseService, 'find');
    mock.mockImplementation(async () => mockObj);

    const results = await ParseTextSearch.search('juan', {
      scope: ['_User', 'Country', 'City'],
      format: true,
    });

    expect(results.length).toBeGreaterThan(0);
    expect((<IResult>results[0]).text).toEqual('juan camilo');
  });

  test('should allow filters and return the right results', async () => {
    const mockObj = new Parse.Object('_User');
    mockObj.set('name', 'juan camilo');
    mockObj.set('email', 'juan@hotmail.com');

    const mock = jest.spyOn(ParseService, 'find');
    mock.mockImplementation(async () => mockObj);

    const results = await ParseTextSearch.search('juan', {
      scope: ['_User', 'Country', 'City'],
      format: true,
      filters: {
        _User: {
          matches: {
            email: 'hotmail',
          },
        },
      },
    });

    expect(results.length).toBeGreaterThan(0);
    expect((<IResult>results[0]).text).toEqual('juan camilo');
  });
});

describe('#getSearchQuery', () => {
  test('should return the expected query for _User', () => {
    const query: Parse.Query = ParseTextSearch.getSearchQuery('juan', {
      className: '_User',
      key: 'name',
    });

    const expected = new Parse.Query('_User');
    expected.matches('name', new RegExp('juan', 'ig'), null);
    expected.select('name', 'email');
    expected.limit(10);

    expect(query.toJSON()).toEqual(expected.toJSON());
  });

  test('should return the expected query for Country', () => {
    const query: Parse.Query = ParseTextSearch.getSearchQuery('col', {
      className: 'Country',
      key: 'name',
    });

    const expected = new Parse.Query('Country');
    expected.matches('name', new RegExp('col', 'ig'), null);
    expected.select('name');
    expected.include('continent');
    expected.limit(10);

    expect(query.toJSON()).toEqual(expected.toJSON());
  });

  test('should throw an error if the class is not configured', () => {
    const className = 'City';

    expect(() => {
      ParseTextSearch.getSearchQuery('col', {
        className,
        key: 'name',
      });
    }).toThrowError(`Please configure ${className} before`);
  });
});
