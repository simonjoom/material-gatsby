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

var _Foundation = require('react-native-vector-icons/dist/Foundation');

var _Foundation2 = _interopRequireDefault(_Foundation);

var _Foundation3 = require('react-native-vector-icons/Fonts/Foundation.ttf');

var _Foundation4 = _interopRequireDefault(_Foundation3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var iconFontStyles = '@font-face {\n  src: url(' + _Foundation4.default + ');\n  font-family: Foundation;\n}';

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

var Foundation = function (_React$Component) {
  (0, _inherits3.default)(Foundation, _React$Component);

  function Foundation() {
    (0, _classCallCheck3.default)(this, Foundation);
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
  }

  Foundation.prototype.render = function render() {
    return _react2.default.createElement(_Foundation2.default, this.props);
  };

  return Foundation;
}(_react2.default.Component);

exports.default = Foundation;