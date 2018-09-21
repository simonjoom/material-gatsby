"use strict";

exports.__esModule = true;
exports.default = void 0;

var _AnimatedImplementation = _interopRequireDefault(require("../../vendor/react-native/Animated/AnimatedImplementation"));

var _Image = _interopRequireDefault(require("../Image"));

var _ScrollView = _interopRequireDefault(require("../ScrollView"));

var _Text = _interopRequireDefault(require("../Text"));

var _View = _interopRequireDefault(require("../View"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Animated = _extends({}, _AnimatedImplementation.default, {
  Image: _AnimatedImplementation.default.createAnimatedComponent(_Image.default),
  ScrollView: _AnimatedImplementation.default.createAnimatedComponent(_ScrollView.default),
  View: _AnimatedImplementation.default.createAnimatedComponent(_View.default),
  Text: _AnimatedImplementation.default.createAnimatedComponent(_Text.default)
});

var _default = Animated;
exports.default = _default;