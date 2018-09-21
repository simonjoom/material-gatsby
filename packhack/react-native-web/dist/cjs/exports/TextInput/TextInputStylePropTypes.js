"use strict";

exports.__esModule = true;
exports.default = void 0;

var _TextStylePropTypes = _interopRequireDefault(require("../Text/TextStylePropTypes"));

var _propTypes = require("prop-types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var TextInputStylePropTypes = _extends({}, _TextStylePropTypes.default, {
  /* @platform web */
  resize: (0, _propTypes.oneOf)(['none', 'vertical', 'horizontal', 'both'])
});

var _default = TextInputStylePropTypes;
exports.default = _default;