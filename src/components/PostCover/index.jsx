import React, { Component } from "react";
import { StaticQuery, graphql } from "gatsby";
import PostCover from "./PostCoverComponent";

class queryWrapper extends Component {
  render() {
    const { postNode, coverHeight, coverClassName } = this.props;
    console.log("render");
    return (
      <StaticQuery
        query={graphql`
          query CoverQuery {
            allFile(
          filter: {
        absolutePath:{regex:"/(assets)\/.*\\.jpg$/"}
          }
            ) {
              edges {
                node {
                  id
                  absolutePath
                  childImageSharp {
                    id
                    resolutions {
                      base64
                      tracedSVG
                      aspectRatio
                      width
                      height
                      src
                      srcSet
                      srcWebp
                      srcSetWebp
                      originalName
                    }
                    internal {
                      contentDigest
                      type
                      owner
                    }
                    fluid(maxWidth: 1300) {
                      base64
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
          }
        `}
        render={data => {
          return (
            <PostCover
              fileEdges={data.allFile.edges}
              postNode={postNode}
              coverHeight={coverHeight}
              coverClassName={coverClassName}
            />
          );
        }}
      />
    );
  }
}

export default queryWrapper;
