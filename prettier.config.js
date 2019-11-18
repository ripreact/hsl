module.exports = {
    endOfLine: 'lf',
    htmlWhitespaceSensitivity: 'ignore',
    jsxSingleQuote: true,
    printWidth: 120,
    quoteProps: 'consistent',
    semi: true,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'none',
    arrowParens: 'avoid',
    proseWrap: 'always',
    overrides: [
        {
            files: ['*.md'],
            options: {
                printWidth: 80
            }
        }
    ]
};
