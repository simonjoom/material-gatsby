import React from "react";
import i18n from "i18next";
import { ThemeContext } from "./withContext";
import trfr from "./layouts/translate_fr";
import tren from "./layouts/translate_en";
import trpt from "./layouts/translate_pt";
import trru from "./layouts/translate_ru";
import truk from "./layouts/translate_uk";
import trch from "./layouts/translate_ch";
import statics from "./layouts/statics";

global.Zepto = undefined;
const getLanguage = () => i18n.language;

global.isSSR = true;

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

export const wrapPageElement = async ({ element, props }) => {
  const { lng } = props.pageContext;
  let Red, Red2;
  if (global.menuList[lng].length == 0 || getLanguage() !== lng) {
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

  if (global.filesQuery.length == 0) {
    Red2 = statics;
  } else {
    Red2 = "div";
  }
  // console.log("Red2", Red2, lng);
  const { slug, slugbase, route, carousel } = props.pageContext;
  const namespace = slugbase === "/" ? "Index" : "Post";
  const ismain = slugbase === "/";
  console.log("runMainNavLayout", lng);
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
