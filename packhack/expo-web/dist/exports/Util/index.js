'use strict';

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

require('moment-timezone');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Util = {
  getCurrentDeviceCountryAsync: function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var lang;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              lang = navigator.browserLanguage;

              if (typeof lang === 'undefined') {
                lang = navigator.language;
              }
              return _context.abrupt('return', lang);

            case 3:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    function getCurrentDeviceCountryAsync() {
      return _ref.apply(this, arguments);
    }

    return getCurrentDeviceCountryAsync;
  }(),
  getCurrentLocaleAsync: function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt('return', navigator.languages[0]);

            case 1:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    function getCurrentLocaleAsync() {
      return _ref2.apply(this, arguments);
    }

    return getCurrentLocaleAsync;
  }(),
  getCurrentTimeZoneAsync: function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              return _context3.abrupt('return', _moment2.default.tz.guess());

            case 1:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    }));

    function getCurrentTimeZoneAsync() {
      return _ref3.apply(this, arguments);
    }

    return getCurrentTimeZoneAsync;
  }(),
  reload: function reload() {
    return window.location.reload(true);
  }
};

exports.default = Util;