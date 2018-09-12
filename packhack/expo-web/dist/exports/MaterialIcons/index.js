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

var _MaterialIcons = require('react-native-vector-icons/dist/MaterialIcons');

var _MaterialIcons2 = _interopRequireDefault(_MaterialIcons);

var _MaterialIcons3 = require('react-native-vector-icons/Fonts/MaterialIcons.ttf');

var _MaterialIcons4 = _interopRequireDefault(_MaterialIcons3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var iconFontStyles = '@font-face {\n  src: url(' + _MaterialIcons4.default + ');\n  font-family: MaterialIcons;\n}';

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

var MaterialIcons = function (_React$Component) {
  (0, _inherits3.default)(MaterialIcons, _React$Component);

  function MaterialIcons() {
    (0, _classCallCheck3.default)(this, MaterialIcons);
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
  }

  MaterialIcons.prototype.render = function render() {
    return _react2.default.createElement(_MaterialIcons2.default, this.props);
  };

  return MaterialIcons;
}(_react2.default.Component);

exports.default = MaterialIcons;