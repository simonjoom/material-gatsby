import React from "react";
import Img from "gatsby-image";
import withTheme from '../../withContext'; 
import Carousel from "./carousel.js";
import "./carousel.css";

const GetImage = ({
  CarouselQuery,
  dataList,
  coverclassname,
  width,
  ismain,
  height = "50%",
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
                        tabIndex="0"
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
            positionImage={"right"} 
            fluid={FileNode.node.childImageSharp.fluid}
            height={height}
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
  height = "50%",
  ismain,
  translate,
  alt = ""
}) => { 
  if (!data) return null;
  let datas = typeof data == "string" ? data.split() : data;
  let Query = global.filesQuery;
  if (datas.length == 0) return null;
  if (Query)
    return (
      <GetImage
        CarouselQuery={Query}
        dataList={datas}
        directory={directory}
        width={width}
        height={height}
        maxWidth={maxwidth}
        ismain={ismain}
        t={translate("Index")}
        coverclassname={coverclassname}
        alt={alt}
      />
    );
  return null;
};

export default withTheme(FrontCarousel);
