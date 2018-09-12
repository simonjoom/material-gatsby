'use strict';

exports.__esModule = true;
var WebBrowser = {
  dismissBrowser: function dismissBrowser() {},
  openAuthSessionAsync: function openAuthSessionAsync(url) {
    return window.open(url);
  },
  openBrowserAsync: function openBrowserAsync(url) {
    return window.open(url, '_blank');
  }
};

exports.default = WebBrowser;