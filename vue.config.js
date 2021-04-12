// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const IS_PROD = process.env.NODE_ENV === 'production';
let publicPath = process.env.VUE_APP_PUBLIC_PATH;

module.exports = {
  publicPath: publicPath ? publicPath : "/",
  outputDir: 'dist',
  assetsDir: '',
  lintOnSave: false,
  runtimeCompiler: true,
  productionSourceMap: !IS_PROD,
  parallel: require("os").cpus().length > 1,
  css: {
    extract: IS_PROD,
    sourceMap: false,
  },
  //
  devServer: IS_PROD ? {} : {
    quiet: false,
    inline: true,
    stats: 'errors-only',
    overlay: false,
    clientLogLevel: 'silent',
    compress: true,
    disableHostCheck: true
  },
  configureWebpack: config => {
    config.externals = {
      // axios: "axios",
    };
    const plugins = [];
    if (IS_PROD) {
      //关闭bundleAnalyzer
      // plugins.push(new BundleAnalyzerPlugin())
    }
    return {
      plugins
    }
  },
  chainWebpack: config => {
    const oneOfsMap = config.module.rule('scss').oneOfs.store
    oneOfsMap.forEach(item => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          // 要公用的scss的路径
          resources: './src/assets/css/element-common.scss'
        })
        .end()
    })
  },
}
