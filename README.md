# @ripreact/hsl

> Minimal (≈650 bytes minigzip) and fast (≈13% faster than original)
> [HSLᵤᵥ](http://hsluv.org) implementation with TypeScript support.

```shell script
yarn add @ripreact/hsl
```

## Usage

```javascript
import { hsl } from '@ripreact/hsl';

console.log(hsl(0, 100, 50, 0.5)); // → `'#ea006480'`
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
