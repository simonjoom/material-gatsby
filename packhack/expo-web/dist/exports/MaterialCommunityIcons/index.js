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

var _MaterialCommunityIcons = require('react-native-vector-icons/dist/MaterialCommunityIcons');

var _MaterialCommunityIcons2 = _interopRequireDefault(_MaterialCommunityIcons);

var _MaterialCommunityIcons3 = require('react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf');

var _MaterialCommunityIcons4 = _interopRequireDefault(_MaterialCommunityIcons3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var iconFontStyles = '@font-face {\n  src: url(' + _MaterialCommunityIcons4.default + ');\n  font-family: MaterialCommunityIcons;\n}';

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

var MaterialCommunityIcons = function (_React$Component) {
  (0, _inherits3.default)(MaterialCommunityIcons, _React$Component);

  function MaterialCommunityIcons() {
    (0, _classCallCheck3.default)(this, MaterialCommunityIcons);
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
  }

  MaterialCommunityIcons.prototype.render = function render() {
    return _react2.default.createElement(_MaterialCommunityIcons2.default, this.props);
  };

  return MaterialCommunityIcons;
}(_react2.default.Component);

exports.default = MaterialCommunityIcons;