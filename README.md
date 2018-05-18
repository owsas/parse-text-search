# Parse Text Search

A Javascript API with utils for searching on your Parse server

## Usage

```ts
import { ParseService } from '@owsas/parse-service';

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

const results = await ParseTextSearch.search('juan', {
  scope: ['_User'],
});
console.log(results[0]) // a Parse.Object

// or you can get IResult types using format: true
const results = await ParseTextSearch.search('juan', {
  scope: ['_User'],
  format: true,
});

console.log(results[0]) // an IResult
```

The IResult interface is the following:
```ts
interface IResult {
  text: string;
  objectId: string;
  className: string;
  img?: any; // may be a string, or a Parse.File depending on your class
}
```

Furthermore, the ISearchConfig, which serves for configuring the search results goes as follows:
```ts
interface ISearchConfig {
  [className:string]: { // For example: _User
    search: string; // which keys to search on. Ex: 'name', or 'name,email'
    textKey: string; // obligatory: The key of your class that is going to be returned as the text on an IResult
    include?: string[]; // if you want to include any pointer in your results
    select?: string[]; // if you want to select more keys. By default, only the search keys are selected
    imgKey?: string; // if you want the img key on an IResult to be set
  };
}
```

### Advanced search
You won't always want to search all the items in your database. Sometimes you will want to filter more. For this cases, you can use all the configuration options available in [`parse-query-gen`](https://www.npmjs.com/package/parse-query-gen).

For example:
```ts
const results = await ParseTextSearch.search('juan', {
  scope: ['_User'],
  filters: {
    _User: {
      matches: {
        email: 'gmail',
      },
    },
  },
});
```

In this case, you would get all the users whose name contains juan, and whose email is from gmail.

Please check out the documentation of `parse-query-gen`. This may get out of date as `parse-query-gen` adds more features. At the time being (May 2018), all the configuration options are:

```ts
interface IParams {
  className?: string; 
  equalTo?: {[key:string]: any}; // example: { great: true }
  containedIn?: {[key:string]: any};
  notEqualTo?: {[key:string]: any}; 
  lessThan?: {[key:string]: any};
  greaterThan?: {[key:string]: any}; 
  containsAll?: {[key:string]: any};  
  include?: string[];
  descending?: string[]; 
  ascending?: string[]; 
  query?: any;
  matches?: {[key:string]: any;}; 
  select?: string[];
}
```

## Dev Mode

Clone this repo, and start adding your code in the `index.ts` file.  
When you are done, write the tests in the `index.test.ts` file. For testing, this repo works with [Jest](https://facebook.github.io/jest/).

Once you finished, you can publish your module to npm with `npm publish`. This will compile your Typescript code
and send it to npm.

Make sure to change the name of the package in `package.json`

## Dev Features
* Testing with Jest
* Linting out of the box (checks the style of your code), with TSLint
* Build, prepublish and other scripts to help you to develop
* Works with Typescript: Static typing for your JS Applications, reducing amount of runtime errors
* Coverage out of the box, thanks to Jest
* Uses deterministic module resolving, with Yarn

## Credits

Developed by Juan Camilo Guarín Peñaranda,  
Otherwise SAS, Colombia  
2017

## License 

MIT.

## Support us on Patreon
[![patreon](./repo/patreon.png)](https://patreon.com/owsas)
