'use strict';

exports.__esModule = true;

var _uaParserJs = require('ua-parser-js');

var _uaParserJs2 = _interopRequireDefault(_uaParserJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ua = (0, _uaParserJs2.default)(navigator.userAgent);

var Constants = {
  statusBarHeight: 0,
  expoVersion: 'n/a',
  expoRuntimeVersion: 'n/a',
  linkingUri: window.location.href.split('?')[0].split('#')[0],
  isDevice: true,
  manifest: {
    sdkVersion: 'expo-web',
    privacy: 'public',
    version: '1.0.0',
    orientation: 'landscape',
    primaryColor: '#000000',
    splash: {
      image: './src/assets/images/splash.png',
      backgroundColor: '#ffffff',
      resizeMode: 'contain'
    },
    ios: {
      supportsTablet: true
    }
  },
  platform: {
    web: ua,
    statusBarHeight: 0
  }
};

exports.default = Constants;