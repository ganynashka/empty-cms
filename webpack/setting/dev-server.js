const path = require('path');

const {cwd, pathToDist, ssrServerPort, isBuildServer, webpackDevServerPort} = require('./../config');

const mainProxyUrlSetting = {
    target: 'http://localhost:' + ssrServerPort + '/',
    changeOrigin: true, // for this option only: see documentations here https://github.com/chimurai/http-proxy-middleware#http-proxy-middleware-options
};

module.exports.devServer = {
    host: 'localhost',
    port: webpackDevServerPort,
    contentBase: path.join(cwd, pathToDist),
    historyApiFallback: {
        disableDotRule: true,
    },
    writeToDisk: isBuildServer,
    // inline: false,
    // hot: true,
    // hotOnly: false,
    disableHostCheck: true,
    proxy: {
        '/manifest.json': mainProxyUrlSetting,
        '/api/': mainProxyUrlSetting,
        '/upload-file/': mainProxyUrlSetting,
    },
};
