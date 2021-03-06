"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _resolve = _interopRequireDefault(require("./resolve"));

exports.onCreateWebpackConfig = ({
  actions,
  stage,
  rules,
  plugins,
  loaders
}, _ref) => {
  let postCssPlugins = _ref.postCssPlugins,
      sassOptions = (0, _objectWithoutPropertiesLoose2.default)(_ref, ["postCssPlugins"]);
  const setWebpackConfig = actions.setWebpackConfig;
  const PRODUCTION = stage !== `develop`;
  const isSSR = stage.includes(`html`);
  const sassLoader = {
    loader: (0, _resolve.default)(`sass-loader`),
    options: Object.assign({
      sourceMap: !PRODUCTION
    }, sassOptions)
  };
  const sassRule = {
    test: /\.s(a|c)ss$/,
           sideEffects: true,
    use: isSSR ? [loaders.null()] : [loaders.miniCssExtract(), loaders.css({
      importLoaders: 2
    }), loaders.postcss({
      plugins: postCssPlugins
    }), sassLoader]
  };
  const sassRuleModules = {
    test: /\.module\.s(a|c)ss$/,
    use: [!isSSR && loaders.miniCssExtract(), loaders.css({
      modules: true,
      importLoaders: 2
    }), loaders.postcss({
      plugins: postCssPlugins
    }), sassLoader].filter(Boolean)
  };
  let configRules = [];

  switch (stage) {
    case `develop`:
    case `build-javascript`:
    case `build-html`:
    case `develop-html`:
      configRules = configRules.concat([{
        oneOf: [sassRuleModules, sassRule]
      }]);
      break;
  }

  setWebpackConfig({
    module: {
      rules: configRules
    }
  });
};