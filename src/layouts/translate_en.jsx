import React from "react";
import i18n from "i18next";
import { graphql, StaticQuery } from "gatsby";
let run = true;

const translate = () => {
  if (!global.locale["en"].length == 0) {
    console.log("runtranslate");
    return (
      <StaticQuery
        query={graphql`
          query trenQuery {
            allLocale(filter: { lng: { eq: "en" } }) {
              edges {
                node {
                  id
                  lng
                  ns
                  data
                }
              }
            }
            allMarkdownRemark(
              limit: 2000
              filter: { fields: { type: { eq: "pages" }, lng: { eq: "en" } } }
              sort: { fields: [fields___date], order: DESC }
            ) {
              edges {
                node {
                  fields {
                    inmenu 
                    slug 
                  }
                  frontmatter {
                    title
                  }
                }
              }
            }
          }
        `}
        render={data => {
          let lang;
          run = false;
          console.log("changeLanguage", data); 
          data.allLocale.edges.forEach(({ node }) => {
            const { lng, ns, data } = node;
            lang = lng;
            if (!i18n.hasResourceBundle(lng, ns)) {
              i18n.addResources(lng, ns, JSON.parse(data));
            }
          });
          global.locale[lang] = data.allLocale.edges;
          i18n.changeLanguage(lang);
          let t = namespace => i18n.getFixedT(null, [namespace, "common"]);

          global.postEdges = data.allMarkdownRemark.edges;
          global.postEdges.forEach(postEdge => {
            const { title } = postEdge.node.frontmatter;
            const tr = t("Index")(title);
            if (postEdge.node.fields.inmenu)
            global.menuList["en"].push({
                path: postEdge.node.fields.slug,
                title: tr
              });
          });

          console.log("changeLanguage", lang);
          return <div />;
        }}
      />
    );
  } else {
    i18n.changeLanguage("en");
    return <div />;
  }
};
export default translate;
