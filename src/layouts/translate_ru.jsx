import React from "react";
import i18n from "i18next";
const _ = require("lodash");
import { router } from "../config";
import { graphql, StaticQuery } from "gatsby";
const translate = () => {
  if (global.locale["ru"].length == 0) {
    console.log("runtranslate");
    return (
      <StaticQuery
        query={graphql`
          query trruQuery {
            allLocale(filter: { lng: { eq: "ru" } }) {
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
              filter: { fields: { type: { eq: "pages" }, lng: { eq: "ru" } } }
              sort: { fields: [fields___date], order: DESC }
            ) {
              edges {
                node {
                  fields {
                    inmenu
                    slug
                  }
                  frontmatter {
                    category
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
            const { lng, ns, data : datan } = node;
            lang = lng;
            if (!i18n.hasResourceBundle(lng, ns)) {
              i18n.addResources(lng, ns, JSON.parse(datan));
            }
          });
          global.locale["ru"] = data.allLocale.edges;
          i18n.changeLanguage("ru");
          let t = namespace => i18n.getFixedT(null, [namespace, "common"]);

          global.postEdges = data.allMarkdownRemark.edges;
          let array = [];

          Object.keys(router).forEach(function(element, key, _array) {
            global.postEdges.forEach(postEdge => {
              const { category } = postEdge.node.frontmatter;
              const tr = t("Index")(_.kebabCase(category));
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
          console.log("changeLanguage", lang);
          return <div />;
        }}
      />
    );
  } else {
    i18n.changeLanguage("ru");
    return <div />;
  }
};
export default translate;
