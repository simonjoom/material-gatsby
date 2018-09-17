import React from "react";
import Img from "gatsby-image";
import { graphql, StaticQuery } from "gatsby";
import Carousel from "./carousel";
import "./carousel.css";
let CarouselQuery;

const GetImage = ({ CarouselQuery, dataList, coverClassName,width }) => {
  const MapImg = dataList.map((el, ind) => {
    const FileNode = CarouselQuery.find(function(element) {
      return element.node.absolutePath.indexOf("/static/assets/" + el) !== -1;
    });
    if (FileNode)
      return (
        <Img
          className={coverClassName}
          key={ind}
          fluid={FileNode.node.childImageSharp.fluid}
          height="100%"
          width={width}
          maxwidth="1024px"
        />
      );
  });
  console.log("MapImg",MapImg)
  if (MapImg.length > 1)
    return (
      <div className="carousel">
        <Carousel autoPlay infiniteLoop className="carousel-main">
          {MapImg}
        </Carousel>
      </div>
    );
  else {
    if (MapImg.length == 1) return MapImg[0];
    else return <div>NOCOVER</div>;
  }
};
const FrontCarousel = ({ dataList, coverClassName,width }) => {
  if (dataList.length == 0) return null;
  //console.log("check", dataList, CarouselQuery);
  if (CarouselQuery)
    return (
      <GetImage
        CarouselQuery={CarouselQuery}
        dataList={dataList}
        width={width}
        coverClassName={coverClassName}
      />
    );
  else
    return (
      <StaticQuery
        query={graphql`
            query CarouselQuery {
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
          CarouselQuery = data.allFile.edges;
          return (
            <GetImage
              CarouselQuery={CarouselQuery}
              dataList={dataList}
              width={width}
              coverClassName={coverClassName}
            />
          );
        }}
      />
    );
};

export default FrontCarousel;
