import React from "react";
import Img from "gatsby-image";
import { graphql, StaticQuery } from "gatsby"; 
import Carousel from "./carousel";
import "./carousel.css"; 

const FrontCarousel = ({ dataList }) => { 
  return (
    <StaticQuery
      query={graphql`
            query CarouselQuery {
              allFile(
            filter: {
          absolutePath:{regex:"/(assets)\/carousel.*\\.jpg$/"}
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
        const MapImg = dataList.map((el, ind) => {
          const FileNode = data.allFile.edges.find(function(element) {
              console.log(element.node.absolutePath.indexOf("/static/assets/"+ el)!== -1)
            return (
              element.node.absolutePath.indexOf("/static/assets/"+ el)!== -1
            );
          }); 
          if (FileNode)
            return (
              <Img
                key={ind}
                fluid={FileNode.node.childImageSharp.fluid}
                height="100%"
              />
            );
        }); 

        return (
          <div className="carousel">
            <Carousel
              autoPlay
              infiniteLoop
              className="carousel-main"
            >
              {MapImg}
            </Carousel>
          </div>
        );
      }}
    />
  );
};

export default FrontCarousel;
