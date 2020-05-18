const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

if (process.env.NODE_ENV === 'production') {
    module.exports = {
        publicPath: '',
        // webpack的相关配置在这里
        configureWebpack: {
            plugins: [
                // Gzip压缩
                new CompressionPlugin({
                    algorithm: 'gzip', //'brotliCompress'
                    test: /\.js$|\.html$|\.css/, // + $|\.svg$|\.png$|\.jpg
                    threshold: 10240, //对超过10k的数据压缩
                    deleteOriginalAssets: false //不删除原文件
                }),
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: false,
                    terserOptions: {
                        compress: {
                            drop_console: true,
                            drop_debugger: true,
                        },
                    },
                }),
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
    }
}
