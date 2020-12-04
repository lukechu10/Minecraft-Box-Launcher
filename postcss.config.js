const tailwind = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const atImport = require("postcss-import")();

const plugins =
    process.env.NODE_ENV === "production"
        ? [atImport, tailwind, autoprefixer, cssnano]
        : [atImport, tailwind, autoprefixer];

module.exports = { plugins };
