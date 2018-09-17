import React from "react";
import Img from "gatsby-image";
import { graphql, StaticQuery } from "gatsby";
import Carousel from "./carousel";
import "./carousel.css";
let CarouselQuery;

const GetImage = ({
  CarouselQuery,
  dataList,
  coverClassName,
  width,
  alt = "",
  directory = ""
}) => {
  const dir = directory !== "" ? "/" + directory : "";
  const MapImg = dataList
    .map((el, ind) => {
      const FileNode = CarouselQuery.find(function(element) {
        console.log(
          "/static/assets" + dir + "/" + el,
          element.node.absolutePath
        );
        return (
          element.node.absolutePath.indexOf(
            "/static/assets" + dir + "/" + el
          ) !== -1
        );
      });
      if (FileNode)
        return (
          <Img
            className={coverClassName}
            key={ind}
            alt={alt}
            fluid={FileNode.node.childImageSharp.fluid}
            height="100%"
            width={width}
            maxwidth="1024px"
          />
        );
    })
    .filter(n => n);

  console.log("MapImg", MapImg);
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
const FrontCarousel = ({
  data,
  coverClassName,
  width,
  directory,
  alt = ""
}) => { 
  if (!data) return null; 
  let datas = typeof data == "string" ? data.split() : data;

  if (datas.length == 0) return null;
  console.log("check", datas);
  if (CarouselQuery)
    return (
      <GetImage
        CarouselQuery={CarouselQuery}
        dataList={datas}
        directory={directory}
        width={width}
        coverClassName={coverClassName}
        alt={alt}
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
        render={nodes => {
          CarouselQuery = nodes.allFile.edges;
          return (
            <GetImage
              CarouselQuery={CarouselQuery}
              dataList={datas}
              width={width}
              alt={alt}
              directory={directory}
              coverClassName={coverClassName}
            />
          );
        }}
      />
    );
};

export default FrontCarousel;
