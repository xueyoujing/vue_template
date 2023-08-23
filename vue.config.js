const { defineConfig } = require('@vue/cli-service');
const {name} = require('./package');
const path = require('path');

const AutoImport = require('unplugin-auto-import/webpack');
const Components = require('unplugin-vue-components/webpack');
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');

function resolve(dir) {
    return path.join(__dirname, dir)
}

const { getSass } = require('@zougt/some-loader-utils');

const ThemeCssExtractWebpackPlugin = require('@zougt/theme-css-extract-webpack-plugin');

const multipleScopeVars = [
    {
        scopeName: 'light',
        name: '亮色',
        path: 'src/theme/light.scss'
    },
    {
        scopeName: 'dark',
        name: '墨黑',
        path: 'src/theme/dark.scss'
    }
];

require('events').EventEmitter.defaultMaxListeners = 0;

module.exports = defineConfig({
    transpileDependencies: true,

    publicPath: process.env.NODE_ENV === 'production' ? '/xxx/' : '/',
    outputDir: 'dist',
    lintOnSave: false,
    productionSourceMap: false,
    configureWebpack: {
        output: {
            library: `${name}-[name]`,
            libraryTarget: 'umd', // 把微应用打包成 umd 库格式
            chunkLoadingGlobal: `webpackJsonp_${name}`,
        },
        optimization: {
            splitChunks: {
                chunks: "all",
                cacheGroups: {
                    libs: {
                        name: 'chunk-libs',
                        test: /[\\/]node_modules[\\/]/,
                        priority: 10,
                        chunks: 'initial' // only package third parties that are initially dependent
                    },
                    elementPLUS: {
                        name: 'chunk-elementPLUS', // split elementUI into a single package
                        priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                        test: /[\\/]node_modules[\\/]_?element-plus(.*)/ // in order to adapt to cnpm
                    },
                    commons: {
                        name: 'chunk-commons',
                        test: resolve('src/components'), // can customize your rules
                        minChunks: 3, //  minimum common number
                        priority: 5,
                        reuseExistingChunk: true
                    },
                    styles: {
                        name: 'styles',
                        test: /\.(sa|sc|c)ss$/,
                        chunks: 'all',
                        enforce: true
                    }
                }
            }
        },
        plugins: [
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver()],
            }),
        ]
    },
    css: {
        loaderOptions: {
            scss: {
                // 这里的选项会传递给 sass-loader
                implementation: getSass({
                    // getMultipleScopeVars优先于 sassOptions.multipleScopeVars
                    getMultipleScopeVars: (sassOptions) => multipleScopeVars.map((item) => {
                        return { ...item, path: path.resolve(item.path) };
                    }),
                }),
            },
        },
    },
    chainWebpack: config => {
        config
            .plugin('ThemeCssExtractWebpackPlugin')
            .use(ThemeCssExtractWebpackPlugin, [
                {
                    multipleScopeVars,
                    extract: process.env.NODE_ENV === 'production',
                    // extract: false,
                },
            ]);

        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end();
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end();
    },
    devServer: {
        proxy: {
            '/mongodb/': {
                target: "http://gic2panel.gic.pre" // 预生产
            }
        },
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }
});
