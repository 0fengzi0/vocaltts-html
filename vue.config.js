const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');

if (process.env.NODE_ENV === 'production') {
    module.exports = {
        publicPath: 'https://cdn.jsdelivr.net/gh/0fengzi0/VOCALTTS-dist/',
        // 输出目录
        outputDir: 'dist/' + process.env.VUE_APP_APPID,
        // webpack的相关配置在这里
        configureWebpack: {
            plugins: [
                // Gzip压缩
                new CompressionPlugin({
                    algorithm           : 'gzip', //'brotliCompress'
                    test                : /\.js$|\.html$|\.css/, // + $|\.svg$|\.png$|\.jpg
                    threshold           : 10240, //对超过10k的数据压缩
                    deleteOriginalAssets: false //不删除原文件
                }),
                // 代码清理
                new TerserPlugin({
                    cache        : true,
                    parallel     : true,
                    sourceMap    : false,
                    terserOptions: {
                        compress: {
                            drop_console : true,
                            drop_debugger: true,
                        },
                    },
                }),
                // vuetify自动导入
                new VuetifyLoaderPlugin(),
            ]
        }
    };
} else {
    module.exports = {
        publicPath: '',

        // 开发环境配置
        devServer: {
            disableHostCheck: true,
        },
        // webpack的相关配置在这里
        configureWebpack: {
            plugins: [
                // vuetify自动导入
                new VuetifyLoaderPlugin(),
            ]
        }
    };
}
