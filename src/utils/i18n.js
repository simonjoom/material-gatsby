import React, { Component } from "react";
import i18n from "i18next";
import Backend from "i18next-xhr-backend";
import { graphql } from "gatsby";
import LanguageDetector from "i18next-browser-languagedetector";
import { reactI18nextModule, translate as t } from "react-i18next";
import config from "../config";

const options = {
  fallbackLng: "en",
 // load: "languageOnly", // we only provide en, de -> no region specific locals like en-US, de-DE

  // have a common namespace used around the full app
  ns: ["common"],
  defaultNS: "common",

  debug: false, // process.env.NODE_ENV !== 'production',
  saveMissing: true,

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ",",
    format: (value, format, lng) => {
      if (format === "uppercase") return value.toUpperCase();
      return value;
    }
  }
};

if (process.browser) {
  i18n
  .use(Backend) 
    .use(LanguageDetector);
}

i18n.use(reactI18nextModule);

// initialize if not already initialized
if (!i18n.isInitialized) i18n.init(options);

export default i18n;

export function withPathnameObserver(WrappedComponent) {
  return class extends Component {
    componentWillMount() {
      this.changePathname(this.props.location.pathname);
    }
    componentWillUpdate(nextProps) {
      if (this.props.location.pathname !== nextProps.location.pathname) {
        this.changePathname(nextProps.location.pathname);
      }
    }
    changePathname(pathname) {
      const { locales, defaultLocale } = config;
      const locale = pathname.substr(1, 2);
      const language =
        locale && locales.indexOf(locale) > -1 ? locale : defaultLocale;
      if (i18n.language !== language) {
        i18n.changeLanguage(language);
      }
    }
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

export function withLocales(WrappedComponent) {
  return class extends Component {
    componentWillMount() {
      console.log("withLocales",this.props.data)
      if (this.props.data&&this.props.data.locales) {
        let lang;
        this.props.data.locales.edges.forEach(({ node }) => {
          const { lng, ns, data } = node;
lang=lng;
          if (!i18n.hasResourceBundle(lng, ns)) {
            i18n.addResources(lng, ns, JSON.parse(data));
          }
        });
        console.log("changeLanguage",lang)
        i18n.changeLanguage(lang)
      }
    }
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

export function translate(ns = ["common"]) {
  return function Wrapper(WrappedComponent) {
    const Extended = t(ns, { i18n, wait: process.browser })(WrappedComponent);
    return withLocales(Extended);

    //return withLocales(t(ns, options)(WrappedComponent));
  };
}

export const localeFragment = graphql`
  fragment LocaleFragment on LocaleConnection {
    edges {
      node {
        id
        lng
        ns
        data
      }
    }
  }
`;
console.log('this is i18n' + i18n)