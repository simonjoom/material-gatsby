import React from "react";
import Img from "gatsby-image";
import { graphql, StaticQuery } from "gatsby";
import Carousel from "./carousel";
import "./carousel.css";
let CarouselQuery;

const GetImage = ({
  CarouselQuery,
  dataList,
  coverclassname,
  width,
  alt = "",
  maxWidth="1024px",
  directory = ""
}) => {
  console.log("coverClassName",coverclassname)
  const dir = directory !== "" ? "/" + directory : "";
  const MapImg = dataList
    .map((el, ind) => {
      const FileNode = CarouselQuery.find(function(element) {
        /* console.log(
          "/static/assets" + dir + "/" + el,
          element.node.absolutePath
        );*/
        return (
          element.node.absolutePath.indexOf(
            "/static/assets" + dir + "/" + el
          ) !== -1
        );
      });
      if (FileNode)
        return (
          <Img
            className={coverclassname}
            key={ind}
            alt={alt}
            fluid={FileNode.node.childImageSharp.fluid}
            height="100%"
            width={width}
            maxWidth={maxWidth}
          />
        );
    })
    .filter(n => n);

  if (MapImg.length > 1)
    return (
      <Carousel autoPlay infiniteLoop>
        {MapImg}
      </Carousel>
    );
  else {
    if (MapImg.length == 1) return MapImg[0];
    else return <div>NOCOVER</div>;
  }
};
const FrontCarousel = ({
  data,
  coverclassname,
  width,
  maxwidth="1024px",
  directory,
  alt = ""
}) => {
  if (!data) return null;
  let datas = typeof data == "string" ? data.split() : data;
  let Query = CarouselQuery || window.filesQuery;
  if (datas.length == 0) return null;
  if (Query)
    return (
      <GetImage
        CarouselQuery={Query}
        dataList={datas}
        directory={directory}
        width={width}
        maxWidth={maxwidth}
        coverclassname={coverclassname}
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
              maxWidth={maxwidth}
              alt={alt}
              directory={directory}
              coverclassname={coverclassname}
            />
          );
        }}
      />
    );
};

export default FrontCarousel;
