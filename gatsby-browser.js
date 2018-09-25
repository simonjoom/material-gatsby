
var provider = require(`./src/inject-provider`)  
exports.wrapRootElement = provider.wrapRootElement
exports.wrapPageElement = provider.wrapPageElement
exports.replaceHydrateFunction = provider.replaceHydrateFunction