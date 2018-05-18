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
export interface IResult {
  text: string;
  img?: string;
  objectId: string;
  className: string;
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
