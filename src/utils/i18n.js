import React from "react";
import i18n from "i18next";
import Backend from "i18next-xhr-backend";  
import config from "../config";

const options = {
  fallbackLng: "en",
 // load: "languageOnly", // we only provide en, de -> no region specific locals like en-US, de-DE

  // have a common namespace used around the full app
  ns: ["common"],
  defaultNS: "common", 
  debug: false, // process.env.NODE_ENV !== 'production', 

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
 //   .use(LanguageDetector);
}

//i18n.use(reactI18nextModule);

// initialize if not already initialized
if (!i18n.isInitialized) i18n.init(options);

export default i18n;
 