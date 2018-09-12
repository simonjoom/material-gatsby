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

var _FontAwesome = require('react-native-vector-icons/dist/FontAwesome');

var _FontAwesome2 = _interopRequireDefault(_FontAwesome);

var _FontAwesome3 = require('react-native-vector-icons/Fonts/FontAwesome.ttf');

var _FontAwesome4 = _interopRequireDefault(_FontAwesome3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var iconFontStyles = '@font-face {\n  src: url(' + _FontAwesome4.default + ');\n  font-family: FontAwesome;\n}';

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

var FontAwesome = function (_React$Component) {
  (0, _inherits3.default)(FontAwesome, _React$Component);

  function FontAwesome() {
    (0, _classCallCheck3.default)(this, FontAwesome);
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
  }

  FontAwesome.prototype.render = function render() {
    return _react2.default.createElement(_FontAwesome2.default, this.props);
  };

  return FontAwesome;
}(_react2.default.Component);

exports.default = FontAwesome;