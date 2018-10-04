import React from "react";
import i18n from "i18next"; 
import AppRegistry from "./src/react-native-web/src/exports/AppRegistry";
import { ThemeContext } from "./src/withContext";
global.menuList = window.__INITIAL_STATE__.menuList;
global.filesQuery = window.__INITIAL_STATE__.filesQuery;
global.locale = window.__INITIAL_STATE__.locale;

/*const initialState = {
  menuList: global.menuList,
  filesQuery: global.filesQuery
};
const preloadedState =window.__INITIAL_STATE__ || initialState; 

const reducermenuList = (state=global.menuList, action) => {
  return state;
};
const reducerfilesQuery = (state=global.filesQuery, action) => { 
  return state;
};
const rootReducer = combineReducers({ menuList:reducermenuList,filesQuery:reducerfilesQuery });

const store = createStore(rootReducer, preloadedState);
console.log("getState", store.getState());*/

const MAsync = () =>
  import(/* webpackChunkName: "materialize" */ "./src/components/materialize");

global.M = undefined;

const getLanguage = () =>
  i18n.language ||
  (typeof window !== "undefined" && window.localStorage.i18nextLng);

var canUseDOM = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

global.isSSR = !canUseDOM;
export const onClientEntry = async () => {
  if (!global.M) {
    const Zep = await MAsync();
    global.M = Zep.default;
  }

  if (/comp|inter|loaded/.test(document.readyState)) {
    Waves.displayEffect();
  } else {
    document.addEventListener(
      "DOMContentLoaded",
      function() {
        Waves.displayEffect();
      },
      false
    );
  }
}

export const replaceHydrateFunction = () => {

  return (element, container, callback) => {
    class App extends React.Component {
      render() {
        return <div id="App">{element}</div>;
      }
    }

    AppRegistry.registerComponent("App", () => App);
    AppRegistry.runApplication("App", {
      initialProps: {},
      rootTag: container,
      callback
    });
  };
};

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

export const wrapPageElement = ({ element, props }) => {
  const { lng } = props.pageContext; 
  if (!lng)
    return (
      <div>
        <div />
        <Layout>{element}</Layout>
      </div>
    );

  global.locale[lng].forEach(({ node }) => {
    const { lng, ns, data } = node;
    if (!i18n.hasResourceBundle(lng, ns)) {
      i18n.addResources(lng, ns, JSON.parse(data));
    }
  });
  i18n.changeLanguage(lng);
  /*const { slug, slugbase, route, carousel } = props.pageContext;
  const namespace = slugbase === "/" ? "Index" : "Post";
  const ismain = slugbase === "/"; */
  return (
    <div>
      <div />
      <Layout lng={lng}>{element}</Layout>
    </div>
  );
};
const stateProvider={translate: namespace => i18n.getFixedT(null, [namespace, "common"])}
export const wrapRootElement = ({ element }) => {
  console.log("stateProvider")
  return (
    <ThemeContext.Provider
      value={stateProvider}
    >
      {element}
    </ThemeContext.Provider>
  );
};
