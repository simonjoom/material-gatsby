import React from "react";
import { router } from "../config";
import { graphql, StaticQuery } from "gatsby";
let run = true;
const statics = ({ lng }) => {
  console.log("runstaticsz",lng)
  if (run)
    return (
      <StaticQuery
        query={graphql`
        query globalQuery {
    allFile(
            filter: {
          absolutePath:{regex:"/(assets)\/.*\\.(jpg$|png$)/"}
            }
              ) {
                edges {
                  node {
                    id
                    absolutePath
                    childImageSharp {
                      id
                      fluid(maxWidth: 1300) {
                        tracedSVG
                        aspectRatio
                        src
                        srcSet
                        sizes
                        srcWebp
                        srcSetWebp
                        originalName
                      }
                    }
                  }
                }
              }
          allMarkdownRemark(
            limit: 2000
            filter: { fields: { type: { eq: "pages" } } }
            sort: { fields: [fields___date], order: DESC }
          ) {
            edges {
              node {
                fields {
                  inmenu
                  carousel
                  slug
                  lng
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
          run = false;
          console.log("runstatic", global.trname);
          //generate Menu from allMarkdownRemark
          const postEdges = data.allMarkdownRemark.edges;
          postEdges.forEach(postEdge => {
            let title;
            if (postEdge.node.fields.lng === lng) {
              //console.log("testslug", postEdge.node.fields.slug);
              // title = t(postEdge.node.frontmatter.title);
              title = postEdge.node.frontmatter.title;
              if (postEdge.node.fields.inmenu)
                global.postList.push({
                  path: postEdge.node.fields.slug,
                  title
                });
            }
          });
          global.filesQuery = data.allFile.edges;
          const t = global.trname("Index");
          global.postList.push({
            path: router["/instructor/"][lng],
            title: t("instructor")
          });
          global.postList.push({
            path: router["/blog/"][lng],
            title: t("blog")
          });

          return <div />;
        }}
      />
    );
  else return <div />;
};
export default statics;
