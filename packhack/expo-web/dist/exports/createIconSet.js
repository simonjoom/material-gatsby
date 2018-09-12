'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.default = function (glyphMap, fontName, expoAssetId) {
  var _font;

  var font = (_font = {}, _font[fontName] = expoAssetId, _font);
  var RNVIconComponent = (0, _createIconSet2.default)(glyphMap, fontName);

  var Icon = function (_React$Component) {
    (0, _inherits3.default)(Icon, _React$Component);

    function Icon() {
      var _temp, _this, _ret;

      (0, _classCallCheck3.default)(this, Icon);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
        fontIsLoaded: _expo.Font.isLoaded(fontName)
      }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    Icon.prototype.componentWillMount = function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this._mounted = true;

                if (this.state.fontIsLoaded) {
                  _context.next = 5;
                  break;
                }

                _context.next = 4;
                return _expo.Font.loadAsync(font);

              case 4:
                this._mounted && this.setState({ fontIsLoaded: true });

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function componentWillMount() {
        return _ref.apply(this, arguments);
      }

      return componentWillMount;
    }();

    Icon.prototype.componentWillUnmount = function componentWillUnmount() {
      this._mounted = false;
    };

    Icon.prototype.setNativeProps = function setNativeProps(props) {
      if (this._icon) {
        this._icon.setNativeProps(props);
      }
    };

    Icon.prototype.assignView = function assignView(view) {
      this._icon = view;
    };

    Icon.prototype.render = function render() {
      if (!this.state.fontIsLoaded) {
        return _react2.default.createElement(_reactNative.Text, null);
      }

      return _react2.default.createElement(RNVIconComponent, (0, _extends3.default)({ ref: this.assignView }, this.props));
    };

    return Icon;
  }(_react2.default.Component);

  Icon.defaultProps = RNVIconComponent.defaultProps;
  Icon.propTypes = process.env.NODE_ENV !== "production" ? RNVIconComponent.propTypes : {};


  Icon.Button = (0, _iconButton2.default)(Icon);
  Icon.glyphMap = glyphMap;
  Icon.font = font;

  return Icon;
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactNative = require('react-native');

var _expo = require('expo');

var _createIconSet = require('./vendor/react-native-vector-icons/lib/create-icon-set');

var _createIconSet2 = _interopRequireDefault(_createIconSet);

var _iconButton = require('./vendor/react-native-vector-icons/lib/icon-button');

var _iconButton2 = _interopRequireDefault(_iconButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }