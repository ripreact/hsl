const snapshot = require('./snapshot-rev4-a');
const { hsl } = require('..');

for (const { source, result } of snapshot) {
    if (!hsl(...source).startsWith(result)) {
        throw new Error('Ti pidor.');
    }
}

console.log('ok');
