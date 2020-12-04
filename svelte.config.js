const sveltePreprocess = require("svelte-preprocess");

module.exports = {
    preprocess: sveltePreprocess({
        postcss: {
            plugins: [
                require("tailwindcss"),
                require("autoprefixer"),
                require("postcss-nesting"),
            ],
        },
    }),
};
