'use strict';

exports.__esModule = true;

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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _reactNative = require('react-native');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

var AppLoading = function (_React$Component) {
  (0, _inherits3.default)(AppLoading, _React$Component);

  function AppLoading() {
    var _this2 = this;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, AppLoading);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this._startLoadingAppResourcesAsync = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (_this.props.onFinish) {
                _context.next = 2;
                break;
              }

              throw new Error('AppLoading onFinish prop is required if startAsync is provided');

            case 2:
              _context.prev = 2;
              _context.next = 5;
              return _this.props.startAsync();

            case 5:
              _context.next = 16;
              break;

            case 7:
              _context.prev = 7;
              _context.t0 = _context['catch'](2);

              if (_this._isMounted) {
                _context.next = 11;
                break;
              }

              return _context.abrupt('return');

            case 11:
              if (!_this.props.onError) {
                _context.next = 15;
                break;
              }

              _this.props.onError(_context.t0);
              _context.next = 16;
              break;

            case 15:
              throw _context.t0;

            case 16:
              _context.prev = 16;

              // If we get to this point then we know that either there was no error, or the error was
              // handled.
              if (_this._isMounted && _this.props.onFinish) {
                _this.props.onFinish();
              }
              return _context.finish(16);

            case 19:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this2, [[2, 7, 16, 19]]);
    })), _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  AppLoading.prototype.componentDidMount = function componentDidMount() {
    this._isMounted = true;

    // startAsync is optional, you can do this process manually if you prefer (this is mainly for
    // backwards compatibility and it is not recommended)
    if (this.props.startAsync) {
      this._startLoadingAppResourcesAsync().catch(function (error) {
        console.error('AppLoading threw an unexpected error when loading:\n' + error.stack);
      });
    }
  };

  AppLoading.prototype.componentWillUnmount = function componentWillUnmount() {
    this._isMounted = false;
  };

  AppLoading.prototype.render = function render() {
    return _react2.default.createElement(
      _reactNative.View,
      { style: styles.container },
      _react2.default.createElement(
        _reactNative.Text,
        null,
        'Loading...'
      )
    );
  };

  return AppLoading;
}(_react2.default.Component);

exports.default = AppLoading;


AppLoading.propTypes = process.env.NODE_ENV !== "production" ? {
  onError: _propTypes.PropTypes.func,
  onFinish: _propTypes.PropTypes.func,
  startAsync: _propTypes.PropTypes.func
} : {};