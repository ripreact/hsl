import { createRequire } from 'module';

export const { hsl, hsla } = createRequire(import.meta.url)('bindings')('hsl');
