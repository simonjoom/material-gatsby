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

var _EvilIcons = require('react-native-vector-icons/dist/EvilIcons');

var _EvilIcons2 = _interopRequireDefault(_EvilIcons);

var _EvilIcons3 = require('react-native-vector-icons/Fonts/EvilIcons.ttf');

var _EvilIcons4 = _interopRequireDefault(_EvilIcons3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var iconFontStyles = '@font-face {\n  src: url(' + _EvilIcons4.default + ');\n  font-family: EvilIcons;\n}';

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

var EvilIcons = function (_React$Component) {
  (0, _inherits3.default)(EvilIcons, _React$Component);

  function EvilIcons() {
    (0, _classCallCheck3.default)(this, EvilIcons);
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
  }

  EvilIcons.prototype.render = function render() {
    return _react2.default.createElement(_EvilIcons2.default, this.props);
  };

  return EvilIcons;
}(_react2.default.Component);

exports.default = EvilIcons;