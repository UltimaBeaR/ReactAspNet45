module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parser": "babel-eslint",
    "plugins": [
        "react"
    ],
    "rules": {
        "linebreak-style": [
            2,
            "windows"
        ],
        "quotes": [
            2,
            "single"
        ],
        "semi": [
            2,
            "always"
        ],

        "react/jsx-uses-react": 2,
        "react/jsx-uses-vars": 2,

        "no-console": 0,
        "no-constant-condition": 0,

        "indent": 0,

        "no-unused-vars": 1,
        "no-empty": 1
    }
};