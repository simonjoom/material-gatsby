Object.defineProperty(exports,"__esModule",{value:true});exports.getImageSource=exports.ToolbarAndroid=exports.TabBarItemIOS=exports.TabBarItem=exports.Button=exports.FA5Style=undefined;var _createIconSetFromFontawesome=require('./lib/create-icon-set-from-fontawesome5');Object.defineProperty(exports,'FA5Style',{enumerable:true,get:function get(){return _createIconSetFromFontawesome.FA5Style;}});var _FontAwesome5Free=require('./glyphmaps/FontAwesome5Free.json');var _FontAwesome5Free2=_interopRequireDefault(_FontAwesome5Free);var _FontAwesome5Free_meta=require('./glyphmaps/FontAwesome5Free_meta.json');var _FontAwesome5Free_meta2=_interopRequireDefault(_FontAwesome5Free_meta);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var iconSet=(0,_createIconSetFromFontawesome.createFA5iconSet)(_FontAwesome5Free2.default,_FontAwesome5Free_meta2.default,false);exports.default=iconSet;var Button=exports.Button=iconSet.Button;var TabBarItem=exports.TabBarItem=iconSet.TabBarItem;var TabBarItemIOS=exports.TabBarItemIOS=iconSet.TabBarItemIOS;var ToolbarAndroid=exports.ToolbarAndroid=iconSet.ToolbarAndroid;var getImageSource=exports.getImageSource=iconSet.getImageSource;