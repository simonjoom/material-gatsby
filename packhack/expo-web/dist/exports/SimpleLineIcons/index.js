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

var _SimpleLineIcons = require('react-native-vector-icons/dist/SimpleLineIcons');

var _SimpleLineIcons2 = _interopRequireDefault(_SimpleLineIcons);

var _SimpleLineIcons3 = require('react-native-vector-icons/Fonts/SimpleLineIcons.ttf');

var _SimpleLineIcons4 = _interopRequireDefault(_SimpleLineIcons3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var iconFontStyles = '@font-face {\n  src: url(' + _SimpleLineIcons4.default + ');\n  font-family: SimpleLineIcons;\n}';

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

var SimpleLineIcons = function (_React$Component) {
  (0, _inherits3.default)(SimpleLineIcons, _React$Component);

  function SimpleLineIcons() {
    (0, _classCallCheck3.default)(this, SimpleLineIcons);
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
  }

  SimpleLineIcons.prototype.render = function render() {
    return _react2.default.createElement(_SimpleLineIcons2.default, this.props);
  };

  return SimpleLineIcons;
}(_react2.default.Component);

exports.default = SimpleLineIcons;