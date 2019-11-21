const { readFileSync, writeFileSync } = require('fs');

const wabt = require('wabt')();

const wat = wabt.parseWat('index.wat', readFileSync('./src/index.wat'));

wat.validate();

const { buffer } = wat.toBinary({ write_debug_names: false });

writeFileSync('./dist/index.wasm', buffer);
