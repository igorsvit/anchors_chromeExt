'use strict';

const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');
const Reloader = require('advanced-extension-reloader-watch-2/umd/reloader');
const reloader = new Reloader({
    port: 7220,
    watch_dir: 'D:/Igor/Dev/ChromeExtensions/user-utilities/build',
});

reloader.watch();
// Merge webpack configuration files
const config = (env, argv) =>
  merge(common, {
    entry: {
      popup: PATHS.src + '/popup.js',
      contentScript: PATHS.src + '/contentScript.js',
      anchors: PATHS.src + '/anchors.css',
      background: PATHS.src + '/background.js',
    },
    devtool: argv.mode === 'production' ? false : 'source-map',
    plugins: [            {
                apply: (compiler) => {
                    compiler.hooks.done.tap('done', (stats) => {
                        const an_error_occured = stats.compilation.errors.length !== 0;

                        if (an_error_occured) {
                            reloader.play_error_notification({ 
                              extension_id: 'eaahejhibhedfnhcgjkppnopckgcnfkd' });
                        } else {
                            reloader.reload({
                                extension_id: 'eaahejhibhedfnhcgjkppnopckgcnfkd',
                                play_notifications: true,
                                always_open_popup: true,
                                manifest_path: true,
                                always_open_popup_paths: ['popup'],
                            });
                        }
                    });
                },
            },
        ],
  });

module.exports = config;
