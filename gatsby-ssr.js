const provider = require(`./inject-providerssr`)  

exports.wrapRootElement = provider.wrapRootElement
exports.wrapPageElement = provider.wrapPageElement
exports.replaceRenderer = provider.replaceRenderer
