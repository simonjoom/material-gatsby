import React from "react";
import i18n from "i18next";
import { ThemeContext } from "./withContext";
var canUseDOM = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

const filetranslate = lng => import(`./layouts/translate_${lng}`);
const ZeptoAsync = () =>
  import(/* webpackChunkName: "zepto" */ "./components/zepto");
const Statics = () =>
  import(/* webpackChunkName: "statics" */ "./layouts/statics");

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

global.Zepto = undefined;
const getLanguage = () =>
  i18n.language ||
  (typeof window !== "undefined" && window.localStorage.i18nextLng);

export const wrapPageElement = async ({ element, props }) => {
  const { lng } = props.pageContext;
  let Red, Red2;
  if (global.menuList[lng].length == 0 || getLanguage() !== lng) {
    const Obj = await filetranslate(lng);
    Red = Obj.default;
  } else {
    Red = "div";
  }
  if (canUseDOM && !global.Zepto) {
    const Zep = await ZeptoAsync();
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
    global.Zepto = Zep.default;
  }

  if (global.filesQuery.length == 0) {
    const Obj = await Statics();
    Red2 = Obj.default;
  } else {
    Red2 = "div";
  }
  console.log("Red2", Red2, lng);
  const { slug, slugbase, route, carousel } = props.pageContext;
  const namespace = slugbase === "/" ? "Index" : "Post";
  const ismain = slugbase === "/";
  console.log("runMainNavLayout", props.location);
  return (
    <>
      <Red />
      <Red2 lng={lng} />
      <ThemeContext.Provider
        value={{
          translate: namespace => i18n.getFixedT(null, [namespace, "common"])
        }}
      >
        <Layout route={route} lng={lng}>
          {element}
        </Layout>
      </ThemeContext.Provider>
    </>
  );
};

// eslint-disable-next-line react/prop-types,react/display-name
/*export default ({ element }) => (
  <div>{element}</div>
)*/

//<ApolloProvider client={apolloClient}>{element}</ApolloProvider>
