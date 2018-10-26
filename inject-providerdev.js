import React, { Component, Fragment } from "react";
import AppRegistry from "./src/react-native-web/src/exports/AppRegistry";
import { ThemeContext } from "./src/withContext";
import i18n from "i18next";

import trfr from "./src/layouts/translate_fr";
import tren from "./src/layouts/translate_en";
import trpt from "./src/layouts/translate_pt";
import trru from "./src/layouts/translate_ru";
import truk from "./src/layouts/translate_uk";
import trch from "./src/layouts/translate_ch";

import { render, hydrate } from "react-dom";
const renderFn = process.env.NODE_ENV !== "production" ? render : hydrate;

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep(fn, ...args) {
  await timeout(3000);
  return fn(...args);
}

global.M = undefined;
global.lng = undefined
const getLanguage = () =>
  i18n.language ||
  (typeof window !== "undefined" && window.localStorage.i18nextLng);
 
const MAsync = () =>
  import(/* webpackChunkName: "materialize" */ "./src/components/materialize");
const chatAsync = () => import(/* webpackChunkName: "chat" */ "./src/chat");
//const Chat = require("./src/chat").default;
global.locale = { en: [], ru: [], pt: [], uk: [], ch: [], fr: [] };
global.menuList = { en: [], ru: [], pt: [], uk: [], ch: [], fr: [] };
global.filesQuery = [];
const preferDefault = m => (m && m.default) || m;
let Layout;
try {
  Layout = preferDefault(require(GATSBY_LAYOUT_COMPONENT_PATH));
} catch (e) {
  if (e.toString().indexOf(`Error: Cannot find module`) !== -1) {
    throw new Error(
      `Couldn't find layout component at "${GATSBY_LAYOUT_COMPONENT_PATH}.\n\n` +
        `Please create layout component in that location or specify path to layout component in gatsby-config.js`
    );
  } else {
    throw e;
  }
}
export const onClientEntry = async () => {
  if (!global.M) {
    const Zep = await MAsync();
    global.M = Zep.default;
  }
  if (/comp|inter|loaded/.test(document.readyState)) {
    Waves.displayEffect();
    M.startTextFields();
  } else {
    document.addEventListener(
      "DOMContentLoaded",
      function() {
        M.startTextFields();
        Waves.displayEffect();
      },
      false
    );
  }
};

export const replaceHydrateFunction = () => {
  return (element, container, callback) => {
    // const el=element.children?;
    class App extends Component {
      render() {
        return (
          <div id="App">
            {element}
            <div id="myChat" />
          </div>
        );
      }
    }
    const runChat = async () => {
      const Chat = await chatAsync();
      return Chat.default;
    };
    const firstcall = () => {
      const ct = document.getElementById("myChat");
      timeout(2000).then(() => {
        runChat().then(El => renderFn(<El />, ct, () => {}));
      });
      return callback;
    };

    AppRegistry.registerComponent("App", () => App);
    AppRegistry.runApplication("App", {
      initialProps: {},
      rootTag: container,
      callback: firstcall
    });
  };
};

global.Red = undefined;

export const wrapPageElement = ({ element, props }) => {
  const { location } = props;
  const { lng } = props.pageContext;
  i18n.changeLanguage(lng);
  let Red;
  console.log("wrap", lng);
  if (!lng) console.log("nolang");
  else if (global.menuList[lng].length == 0) {
    Red =
      lng == "fr"
        ? trfr
        : lng == "pt"
          ? trpt
          : lng == "uk"
            ? truk
            : lng == "ru"
              ? trru
              : lng == "ch"
                ? trch
                : tren;
  } else {
    Red = "div";
  }

  return (
    <div>
      <Red />
      <Layout lng ={lng}>{element}</Layout>
    </div>
  );
};

const stateProvider = {
  translate: namespace => i18n.getFixedT(null, [namespace, "common"])
};
export const wrapRootElement = ({ element }) => {
  global.tr = namespace => i18n.getFixedT(null, [namespace, "common"]);
  return (
    <ThemeContext.Provider value={stateProvider}>
      {element}
    </ThemeContext.Provider>
  );
};
