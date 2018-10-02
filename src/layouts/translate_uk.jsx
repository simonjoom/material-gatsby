import React from "react";
import i18n from "i18next";
import { router } from "../config";
import { graphql, StaticQuery } from "gatsby";
const translate = () => {
  if (global.locale["uk"].length == 0) {
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
          console.log("changeLanguage", data);
          data.allLocale.edges.forEach(({ node }) => {
            const { lng, ns, data } = node;
            lang = lng;
            if (!i18n.hasResourceBundle(lng, ns)) {
              i18n.addResources(lng, ns, JSON.parse(data));
            }
          });
          global.locale["uk"] = data.allLocale.edges;
          i18n.changeLanguage("uk");
          let t = namespace => i18n.getFixedT(null, [namespace, "common"]);

          global.postEdges = data.allMarkdownRemark.edges;
          let array = [];
          Object.keys(router).forEach(function(element, key, _array) {
            global.postEdges.forEach(postEdge => {
              const { title } = postEdge.node.frontmatter;
              const tr = t("Index")(title);
              if (
                postEdge.node.fields.inmenu &&
                postEdge.node.fields.slug == router[element][lang]
              )
                array.push({
                  path: postEdge.node.fields.slug,
                  title: tr
                });
            });
          });

          let item = {
            path: router["/hotel/"][lang],
            title: t("Index")("hotel")
          };
          array.splice(2, 0, item);
          item = {
            path: router["/instructor/"][lang],
            title: t("Index")("instructor")
          };
          array.splice(2, 0, item);
          item = { path: router["/blog/"][lang], title: t("Index")("blog") };
          array.splice(array.length, 0, item);
          global.menuList[lang] = array;
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
