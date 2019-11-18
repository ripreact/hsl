# @ripreact/hsl

> Minimal (≈1k minigzip) and fast (≈23% faster than original)
> [HSLᵤᵥ](http://hsluv.org) implementation with TypeScript support.

```bash
yarn add @ripreact/hsl
```

## Usage

```javascript
// ES module
import { hsl, hsla } from '@ripreact/hsl';

console.log(hsl(0, 100, 50)); //       → `'#ea0064'`
console.log(hsla(0, 100, 50, 0.5)); // → `'#ea006480'`
```

```javascript
// CommonJS
const { hsl, hsla } = require('@ripreact/hsl/cjs');

console.log(hsl(0, 100, 50));
console.log(hsla(0, 100, 50, 0.5));
```

## License

MIT
