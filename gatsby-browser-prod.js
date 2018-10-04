var provider = require('./inject-provider');  
exports.wrapRootElement = provider.wrapRootElement;
exports.wrapPageElement = provider.wrapPageElement;
exports.onClientEntry= provider.onClientEntry;
exports.replaceHydrateFunction = provider.replaceHydrateFunction;

