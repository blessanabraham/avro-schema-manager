const assets = require("postcss-assets");
const reporter = require("postcss-reporter");
const normalize = require("postcss-normalize");
const presetEnv = require("postcss-preset-env");
const flexBugsFixes = require("postcss-flexbugs-fixes");

module.exports = {
    plugins: [
        // require("postcss-import")({
        //     plugins: [
        //         require("stylelint"),
        //     ]
        // }),
        flexBugsFixes,
        assets({
            basePath: ".",
            baseUrl: "/static/",
            loadPaths: ["media/", "fonts/"],
        }),
        presetEnv({
            autoprefixer: {
                flexbox: "no-2009",
            },
            stage: 3,
        }),
        normalize,
        reporter({
            clearReportedMessages: true,
        }),
    ],
};
