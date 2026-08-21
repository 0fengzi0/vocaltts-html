const webpack = require('webpack');
const packageJson = require('./package.json');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

if (process.env.NODE_ENV === 'production') {
    module.exports = {
        // publicPath: process.env.USE_CDN ? 'https://cdn.jsdelivr.net/gh/0fengzi0/VOCALTTS-dist/' : '',
        // 输出目录
        outputDir: 'dist/' + process.env.VUE_APP_APPID,
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
                // 代码清理
                new TerserPlugin({
                    parallel: true,
                    terserOptions: {
                        compress: {
                            drop_console: true,
                            drop_debugger: true,
                        },
                    },
                }),
            ]
        },
        css: {
            loaderOptions: {
                sass: {
                    implementation: require('sass'),
                }
            }
        }
    };
} else {
    module.exports = {
        publicPath: '',

        // 开发环境配置
        devServer: {
            allowedHosts: 'all',
            // 把前端请求代理到本地 Go API，避免浏览器跨域 / localhost 不可达问题
            proxy: {
                '/vocal': {target: 'http://localhost:8080', changeOrigin: true},
                '/synth': {target: 'http://localhost:8080', changeOrigin: true},
                '/placard': {target: 'http://localhost:8080', changeOrigin: true},
                '/api': {target: 'http://localhost:8080', changeOrigin: true},
                '/vocaltts': {target: 'http://localhost:8080', changeOrigin: true},
            },
        },
    };
}

// 注入当前版本号（替代直接导入 package.json，webpack5 无法解析 package.json 模块）
module.exports.chainWebpack = config => {
    config.plugin('define-app-version').use(webpack.DefinePlugin, [{
        __APP_VERSION__: JSON.stringify(packageJson.version)
    }]);
};
