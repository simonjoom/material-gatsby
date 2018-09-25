import React from "react"; 
import { graphql, StaticQuery } from "gatsby";
let run = true;
const statics = () => {  
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
        }
      `}
        render={data => {
          run = false;  
          global.filesQuery = data.allFile.edges; 
          return <div />;
        }}
      />
    );
  else return <div />;
};
export default statics;
