const r = m => require.resolve(m)

function preset(context, options = {}) {
  const { browser = false, debug = false } = options
  const { NODE_ENV, BABEL_ENV } = process.env

  const PRODUCTION = "production"

  const browserConfig = {
    useBuiltIns: false,
    targets: {
      browsers: PRODUCTION
        ? [`last 4 versions`, `safari >= 7`, "ie >= 9"]
        : [`last 2 versions`, `not ie <= 11`, `not android 4.4.3`],
    },
  }

  const nodeConfig = {
    targets: {
      node: "current",
    },
  }

  return {
    presets: [
      [
        r("@babel/preset-env"),
        Object.assign(
          {
            loose: true,
            debug: !!debug, 
            modules: false,
          }
        ),
      ],
      [r("@babel/preset-react"), { development: false }]
    ],
    plugins: [
    r("@babel/plugin-external-helpers"),
    r("babel-plugin-transform-react-remove-prop-types"),
    r("@babel/plugin-transform-flow-strip-types"),
    [
      r("@babel/plugin-proposal-class-properties"),
      {
        "loose": true
      }
    ]
    ],
  }
}

module.exports = preset