import React from "react";
import i18n from "i18next";
//import { createStore, combineReducers } from "redux";
import { AppRegistry } from "react-native-web";
import { ThemeContext } from "./withContext";

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

const ZeptoAsync = () =>
  import(/* webpackChunkName: "zepto" */ "./components/zepto");

global.Zepto = undefined;

const getLanguage = () =>
  i18n.language ||
  (typeof window !== "undefined" && window.localStorage.i18nextLng);

var canUseDOM = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

global.isSSR = !canUseDOM;

export const replaceHydrateFunction = async () => {
  if (!global.Zepto) {
    const Zep = await ZeptoAsync();
    global.Zepto = Zep.default;
  }
  return (element, container, callback) => {
    class App extends React.Component {
      render() {
        return <div id="App">{element}</div>;
      }
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
  let Red, Red2;
  if (!lng) return <Layout>{element}</Layout>;

  global.locale[lng].forEach(({ node }) => {
    const { lng, ns, data } = node;
    if (!i18n.hasResourceBundle(lng, ns)) {
      i18n.addResources(lng, ns, JSON.parse(data));
    }
  });
  i18n.changeLanguage(lng);
  const { slug, slugbase, route, carousel } = props.pageContext;
  const namespace = slugbase === "/" ? "Index" : "Post";
  const ismain = slugbase === "/";
  console.log("runMainNavLayout");
  return <Layout lng={lng}>{element}</Layout>;
};

export const wrapRootElement = ({ element }) => {
  //class LayoutZepto extends React.Component {
   // componentDidMount() {
  //  }
  //  render() {
  //    return this.props.children;
  //  }
 // }

  return (
    <ThemeContext.Provider
      value={{
        translate: namespace => i18n.getFixedT(null, [namespace, "common"])
      }}
    >
      {element}
    </ThemeContext.Provider>
  );
};
