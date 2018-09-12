'use strict';

exports.__esModule = true;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Zocial = require('react-native-vector-icons/dist/Zocial');

var _Zocial2 = _interopRequireDefault(_Zocial);

var _Zocial3 = require('react-native-vector-icons/Fonts/Zocial.ttf');

var _Zocial4 = _interopRequireDefault(_Zocial3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var iconFontStyles = '@font-face {\n  src: url(' + _Zocial4.default + ');\n  font-family: Zocial;\n}';

// Create stylesheet
var style = document.createElement('style');
style.type = 'text/css';
if (style.styleSheet) {
  style.styleSheet.cssText = iconFontStyles;
} else {
  style.appendChild(document.createTextNode(iconFontStyles));
}

// Inject stylesheet
document.head.appendChild(style);

var Zocial = function (_React$Component) {
  (0, _inherits3.default)(Zocial, _React$Component);

  function Zocial() {
    (0, _classCallCheck3.default)(this, Zocial);
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
  }

  Zocial.prototype.render = function render() {
    return _react2.default.createElement(_Zocial2.default, this.props);
  };

  return Zocial;
}(_react2.default.Component);

exports.default = Zocial;