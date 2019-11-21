module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                modules: false,
                shippedProposals: true,
                useBuiltIns: 'usage',
                corejs: 3,
                exclude: ['es.object.to-string', 'es.regexp.to-string'],
            },
        ],
        '@babel/preset-typescript',
    ],
};
