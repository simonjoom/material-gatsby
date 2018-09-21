var context = require.context('.', true, /.+\Spec\.jsZepto/);
context.keys().forEach(context);
module.exports = context;
