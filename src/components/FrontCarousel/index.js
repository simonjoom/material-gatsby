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
  ismain,
  alt = "",
  t,
  maxWidth = "1024px",
  directory = ""
}) => {
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
            content={
              ismain ? (
                <div
                  style={{
                    zIndex: 8,
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    padding: "5px",
                    flexDirection: "column"
                  }}
                  className="md-grid"
                >
                  <span
                    style={{
                      color: "#b2ff59",
                      fontSize: "30px",
                      fontStyle: "italic",
                      fontWeight: 900,
                      letterSpacing: ".01em",
                      textTransform: "uppercase",
                      wordSpacing: "5px"
                    }}
                  >
                    {t("main1")}
                  </span>
                  <div style={{ fontSize: "30px" }}>
                    {t("main2")}
                    <div className="md-cell">
                      <a
                        tabindex="0"
                        href="/instructors_skischool/"
                        style={{
                          color: "#3f51b5",
                          backgroundColor: "#ccff90"
                        }}
                        className="md-btn md-pointer--hover"
                      >
                        {" "}
                        Get Started
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )
            }
            resizeMode={ismain ? "contain" : "center"}
            imgStyle={
              ismain
                ? {
                    backgroundPosition: "right top"
                  }
                : {}
            }
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
  maxwidth = "1024px",
  directory,
  ismain,
  t,
  alt = ""
}) => {
  if (!data) return null;
  let datas = typeof data == "string" ? data.split() : data;
  let Query = CarouselQuery || global.filesQuery;
  if (datas.length == 0) return null;
  if (Query)
    return (
      <GetImage
        CarouselQuery={Query}
        dataList={datas}
        directory={directory}
        width={width}
        maxWidth={maxwidth}
        ismain={ismain}
        t={t}
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
              ismain={ismain}
              maxWidth={maxwidth}
              alt={alt}
              t={t}
              directory={directory}
              coverclassname={coverclassname}
            />
          );
        }}
      />
    );
};

export default FrontCarousel;
