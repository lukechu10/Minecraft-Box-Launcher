const sveltePreprocess = require("svelte-preprocess");

module.exports = {
    preprocess: sveltePreprocess({
        scss: {
            includePaths: ["src/theme"],
        },
        postcss: {
            plugins: [
                require("tailwindcss"),
                require("autoprefixer"),
                require("postcss-nesting"),
            ],
        },
    }),
};
