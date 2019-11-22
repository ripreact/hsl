# @ripreact/hsl

> Minimal (≈670 bytes minigzip) and fast (up to 60% faster than original)
> partial [HSLᵤᵥ](http://hsluv.org) implementation with TypeScript support.

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

> **NB:** By default `@ripreact/hsl` exports `*.mjs` module. If for some reasons
> you need ES module with `*.js` extension, use `@ripreact/hsl/esm` entry point.
> Also, you may specify `@ripreact/hsl/mjs` explicitly to import tha same module
> as using default entry point.

## NAPI addon

```javascript
// Or `@ripreact/hsl/native/cjs` for CommonJS ↓
import { hsl, hsla } from '@ripreact/hsl/native/mjs';

console.log(hsl(0, 100, 50));
console.log(hsla(0, 100, 50, 0.5));
```

## License

MIT
