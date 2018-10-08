import React, { Component } from "react";
import i18n from "i18next";
import AppRegistry from "./src/react-native-web/src/exports/AppRegistry";
import { ThemeContext } from "./src/withContext";
global.M = undefined;
const getLanguage = () =>
  i18n.language ||
  (typeof window !== "undefined" && window.localStorage.i18nextLng);

const filetranslate = lng => import(`./src/layouts/translate_${lng}`);
const MAsync = () =>
  import(/* webpackChunkName: "materialize" */ "./src/components/materialize");

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
  } else {
    document.addEventListener(
      "DOMContentLoaded",
      function() {
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

export const wrapPageElement =  async ({ element, props }) => {
  
  const { lng } = props.pageContext;
  i18n.changeLanguage(lng);
 if (!lng)
    return (
      <div>
        <div />
        <Layout>{element}</Layout>
      </div>
    );
 let Red, Red2;
  if (global.menuList[lng].length == 0) {
    try {
      const Obj = await filetranslate(lng);
      Red = Obj.default;
    } catch (e) {
      Red = "div";
    }
  } else {
    console.log("dev", global.locale);
    global.locale[lng].forEach(({ node }) => {
      const { lng, ns, data } = node;
      if (!i18n.hasResourceBundle(lng, ns)) {
        i18n.addResources(lng, ns, JSON.parse(data));
      }
    });
    Red = "div";
  } 
  console.log("props",global.menuList)
  const { slug, slugbase, route, carousel } = props.pageContext;
  const namespace = slugbase === "/" ? "Index" : "Post";
  const ismain = slugbase === "/";
  console.log("postNodeBefrunMainNavLayout");
  return (
    <div>
      <Red />
      <Layout lng={lng}>{element}</Layout>
    </div>
  ); 
};

const stateProvider = {
  translate: namespace => i18n.getFixedT(null, [namespace, "common"])
};
export const wrapRootElement = ({ element }) => {
  console.log("postNodeBef")
  return (
    <ThemeContext.Provider value={stateProvider}>
      {element}
    </ThemeContext.Provider>
  );
};
