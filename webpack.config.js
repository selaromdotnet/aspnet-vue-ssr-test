const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const bundleOutputDir = './wwwroot/dist';

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);
    const sharedConfig = () => ({
        stats: { modules: false },
        resolve: {
            extensions: ['.js', '.vue'],
            alias: {
                'vue$': 'vue/dist/vue',
                'components': path.resolve(__dirname, './ClientApp/components'),
                'views': path.resolve(__dirname, './ClientApp/views'),
                'utils': path.resolve(__dirname, './ClientApp/utils'),
                'api': path.resolve(__dirname, './ClientApp/store/api')
            }
        },
        output: {
            path: path.join(__dirname, bundleOutputDir),
            filename: '[name].js',
            publicPath: '/dist/'
        },
        module: {
            rules: [
                { test: /\.vue$/, include: /ClientApp/, use: 'vue-loader' },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    include: __dirname,
                    exclude: /node_modules/
                },
                { test: /\.css$/, use: isDevBuild ? ['style-loader', 'css-loader'] : ExtractTextPlugin.extract({ use: 'css-loader' }) },
                { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' }
            ]
        },
    });

    const clientBundleConfig = merge(sharedConfig(), {
        entry: { 'main-client': './ClientApp/client.js' },
        output: {
            path: path.join(__dirname, './wwwroot/dist')
        }
    });

    const serverBundleConfig = merge(sharedConfig(), {
        target: 'node',
        entry: { 'main-server': './ClientApp/server.js' },
        output: {
            libraryTarget: 'commonjs2',
            path: path.join(__dirname, './wwwroot/dist')
        }
    });


    return [clientBundleConfig, serverBundleConfig];
};
