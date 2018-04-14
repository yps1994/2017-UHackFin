module.exports = {
    "parserOptions": {
        "ecmaVersion": 8,
        "ecmaFeatures": {
            "impliedStrict": true
        }
    },
    "plugins": ["node"],
    "extends": ["eslint:recommended", "plugin:node/recommended"],
    "rules": {
        "semi": ["error", "always"],
        "indent": ["error", 2],
        "no-console": "warn"
    },
    "env": {
        "mocha": true
    }
};
