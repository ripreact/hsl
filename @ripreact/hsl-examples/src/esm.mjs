import * as entry from '@ripreact/hsl';
import * as mjs from '@ripreact/hsl/mjs'
import * as c from '@ripreact/hsl/native/mjs'

console.log(entry.hsla(0, 100, 50, 0.5));
console.log(mjs.hsla(0, 100, 50, 0.5));
console.log(c.hsla(0, 100, 50, 0.5));
