var __DEV__ = process.env.NODE_ENV !== "production";

  if (__DEV__) {
    provider = require('./src/inject-providerdev');
  } else {
    provider = require('./src/inject-provider');
  }
  
exports.wrapRootElement = provider.wrapRootElement;
exports.wrapPageElement = provider.wrapPageElement;
exports.replaceHydrateFunction = provider.replaceHydrateFunction;
