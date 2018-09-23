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
          query trukQuery {
            allLocale(filter: { lng: { eq: "uk" } }) {
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
              filter: { fields: { type: { eq: "pages" }, lng: { eq: "uk" } } }
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
          i18n.changeLanguage(lang);
          let t = namespace => i18n.getFixedT(null, [namespace, "common"]);

          global.postEdges = data.allMarkdownRemark.edges;
          global.postEdges.forEach(postEdge => {
            const { title } = postEdge.node.frontmatter;
            if (postEdge.node.fields.inmenu)
            global.menuList["uk"].push({
                path: postEdge.node.fields.slug,
                title: t("Index")(title)
              });
          });
          return <div />;
        }}
      />
    );
  } else {
    i18n.changeLanguage("uk");
    return <div />;
  }
};
export default translate;
