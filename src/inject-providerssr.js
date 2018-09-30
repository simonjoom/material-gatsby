import React from "react";
import i18n from "i18next";
import { AppRegistry } from "react-native-web";
import { renderToString } from "react-dom/server";
import { ThemeContext } from "./withContext";
import trfr from "./layouts/translate_fr";
import tren from "./layouts/translate_en";
import trpt from "./layouts/translate_pt";
import trru from "./layouts/translate_ru";
import truk from "./layouts/translate_uk";
import trch from "./layouts/translate_ch";
//import statics from "./layouts/statics";

global.M = undefined;
const getLanguage = () => i18n.language;

global.isSSR = true;

global.menuList = { en: [], ru: [], pt: [], uk: [], ch: [], fr: [] };
global.filesQuery = [];
global.locale = { en: [], ru: [], pt: [], uk: [], ch: [], fr: [] };
/*
const initialState = {
  menuList: global.menuList,
  filesQuery: global.filesQuery
};
const preloadedState = initialState;

const reducermenuList = (state = global.menuList, action) => {
  return state;
};
const reducerfilesQuery = (state = global.filesQuery, action) => {
  return state;
};
const rootReducer = combineReducers({
  menuList: reducermenuList,
  filesQuery: reducerfilesQuery
});

const store = createStore(rootReducer, preloadedState);
*/
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

function injectState() {
  // const state = store.getState();
  // appends apollo state to the global client window object
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.__INITIAL_STATE__=${JSON.stringify({
          menuList: global.menuList,
          filesQuery: global.filesQuery,
          locale: global.locale
        })};`
      }}
    />
  );
}

export const replaceRenderer = ({
  bodyComponent,
  replaceBodyHTMLString,
  setHeadComponents
}) => {
  class App extends React.Component {
    render() {
      return <div id="App">{bodyComponent}</div>;
    }
  }
  AppRegistry.registerComponent("App", () => App);
  const { element, getStyleElement } = AppRegistry.getApplication("App");
  const html = renderToString(element);
  const styleElement = getStyleElement();

  replaceBodyHTMLString(html);
  setHeadComponents([styleElement, injectState()]);
};

export const wrapPageElement = ({ element, props }) => {
  const { lng } = props.pageContext;
  let Red, Red2;
  if (!lng)
    return (
      <>
        <div />
        <Layout>{element}</Layout>
      </>
    );
  // console.log("global.menuList", lng);
  // console.log("global.menuList", global.menuList[lng]);
  if (global.menuList[lng].length == 0) {
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
  /*
  if (global.filesQuery.length == 0) {
    Red2 = statics;
  } else {
    Red2 = "div";
  }*/
  // console.log("Red2", Red2, lng);
  const { slug, slugbase, route, carousel } = props.pageContext;
  const ismain = slugbase === "/";
  //console.log("runMainNavLayout");

  return (
    <>
      <Red />
      <Layout lng={lng}>{element}</Layout>
    </>
  );
};

const stateProvider={translate: namespace => i18n.getFixedT(null, [namespace, "common"])}
export const wrapRootElement = ({ element }) => (
  <ThemeContext.Provider
    value={stateProvider}
  >
    {element}
  </ThemeContext.Provider>
);
