'use strict';

exports.__esModule = true;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Permissions = {
  NOTIFICATIONS: 'notifications',
  askAsync: function askAsync() {
    return _promise2.default.resolve();
  },
  isDevice: false
};

exports.default = Permissions;