import React from "react";
import i18n from "i18next";
import { graphql, StaticQuery } from "gatsby";
let run=true;
const translate = () => {
  if (run) {
    console.log("runtranslate");
    return (
      <StaticQuery
        query={graphql`
          query trptQuery {
            allLocale(filter: { lng: { eq: "pt" } }) {
              edges {
                node {
                  id
                  lng
                  ns
                  data
                }
              }
            }
          }
        `}
        render={data => {
          let lang;
          run=false;
          console.log("changeLanguage", data);
          data.allLocale.edges.forEach(({ node }) => {
            const { lng, ns, data } = node;
            lang = lng;
            if (!i18n.hasResourceBundle(lng, ns)) {
              i18n.addResources(lng, ns, JSON.parse(data));
            }
          });
          i18n.changeLanguage(lang);
          global.trname = namespace =>
            i18n.getFixedT(null, [namespace, "common"]);
          console.log("changeLanguage", lang);
          return <div />;
        }}
      />
    );
  } else {
    i18n.changeLanguage("pt");
    return <div />;
  }
};
export default translate;
