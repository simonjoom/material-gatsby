"use strict";

exports.__esModule = true;
exports.default = void 0;

var _ColorPropType = _interopRequireDefault(require("../ColorPropType"));

var _ViewStylePropTypes = _interopRequireDefault(require("../View/ViewStylePropTypes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var PickerStylePropTypes = _extends({}, _ViewStylePropTypes.default, {
  color: _ColorPropType.default
});

var _default = PickerStylePropTypes;
exports.default = _default;