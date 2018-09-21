"use strict";

exports.__esModule = true;
exports.default = void 0;

var _ExecutionEnvironment = require("fbjs/lib/ExecutionEnvironment");

var _modality = _interopRequireDefault(require("./modality"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var WebStyleSheet =
/*#__PURE__*/
function () {
  function WebStyleSheet(id) {
    this._cssRules = [];
    this._sheet = null;
    this._textContent = '';
    var domStyleElement; // on the client we check for an existing style sheet before injecting

    if (_ExecutionEnvironment.canUseDOM) {
      domStyleElement = document.getElementById(id);

      if (!domStyleElement) {
        var html = "<style id=\"" + id + "\"></style>";

        if (document.head) {
          document.head.insertAdjacentHTML('afterbegin', html);
          domStyleElement = document.getElementById(id);
        }
      }

      if (domStyleElement) {
        (0, _modality.default)(domStyleElement); // $FlowFixMe

        this._sheet = domStyleElement.sheet;
        this._textContent = domStyleElement.textContent;
      }
    }
  }

  var _proto = WebStyleSheet.prototype;

  _proto.containsRule = function containsRule(rule) {
    return this._cssRules.indexOf(rule) > -1;
  };

  _proto.insertRuleOnce = function insertRuleOnce(rule, position) {
    // Reduce chance of duplicate rules
    if (!this.containsRule(rule)) {
      this._cssRules.push(rule); // Check whether a rule was part of any prerendered styles (textContent
      // doesn't include styles injected via 'insertRule')


      if (this._textContent.indexOf(rule) === -1 && this._sheet) {
        var pos = position || this._sheet.cssRules.length;

        this._sheet.insertRule(rule, pos);
      }
    }
  };

  _createClass(WebStyleSheet, [{
    key: "cssText",
    get: function get() {
      return this._cssRules.join('\n');
    }
  }]);

  return WebStyleSheet;
}();

exports.default = WebStyleSheet;