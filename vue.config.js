/* eslint-disable */
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    configureWebpack: {
        plugins: [
            // new BundleAnalyzerPlugin(),
			new MomentLocalesPlugin({
				localesToKeep: ['es-us'],
			}),
        ]
    },
};