module.exports = {
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === "production" ? "" : "/",

  // There are so many chunks (from all the interfaces / layouts) that we need to make sure to not
  // prefetch them all. Prefetching them all will cause the server to apply rate limits in most cases
  chainWebpack: config => {
    config.plugins.delete("prefetch");
  }
};
