# @ripreact/hsl

> Minimal (≈560 bytes minigzip) [HSLᵤᵥ](http://hsluv.org) implementation with
> TypeScript support.

```shell script
yarn add @ripreact/hsl
```

## Usage

```javascript
// const { hsl } = require('@ripreact/hsl');
import { hsl } from '@ripreact/hsl';

console.log(hsl(0, 100, 50, 0.5)); // → `rgba(234,0,100,0.5)`
```

## Environment

This module uses some ES6+ features:

-   arrow functions,
-   array and object destructuring,
-   default parameters,
-   exponentiation operator,
-   template literals,
-   `Array#{map,reduce}`.

If you need old environments support, you should transpile this module and add
polyfills when needed. When using webpack and Babel, you can add
`include: [require.resolve('@ripreact/hsl')]` to Babel’s rule.

## License

MIT
