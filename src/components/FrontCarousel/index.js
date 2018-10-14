import React from "react";
import Img from "gatsby-image";
import withTheme from "../../withContext";
import ReactFB from "../ReactFB";
import Button from "../../reactLIB/Button";
import Carousel from "./carousel.js";
import route from "../../config";
import "./carousel.css";

const GetImage = ({
  CarouselQuery,
  dataList,
  coverclassname,
  width,
  page,
  height = "50%", 
  t,
  maxWidth = "1024px",
  directory = "",
  ...other
}) => {
  const isContact = page === "/contact/";
  console.log("CarouselQuery",CarouselQuery)
  const ismain = page === "/"; 
  const lng = t("lang");
  const dir = directory !== "" ? "/" + directory : "";
  const MapImg = dataList
    .map((el, ind) => {
      const FileNode = CarouselQuery.find(function(element) { 
        return (
          element.node.absolutePath &&
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
                      fontStyle: "italic",
                      fontWeight: 900,
                      letterSpacing: ".01em",
                      textTransform: "uppercase",
                      wordSpacing: "5px"
                    }}
                    className="h3"
                  >
                    {t("main1")}
                  </span>
                  <div className="h4">
                    {t("main2")}
                    <Button className="bgsecondary md-cell" icontoend icon="thumbs-up black" type="awesome">
                      <a
                        tabIndex="0"
                        href={route.router["/instructor/"][lng]}
                        className="h4 primary"
                      >
                        {" "}
                        Get Started
                        {" "}
                        {" "}
                      </a>
                    </Button>
                  </div>
                </div>
              ) : isContact ? (
                <ReactFB />
              ) : (
                ""
              )
            }
            resizeMode={ismain ? "contain" : "center"}
            positionImage={ismain ? "right" : null}
            fluid={FileNode.node.childImageSharp.fluid}
            height={height}
            width={width}
            maxWidth={maxWidth}
            {...other}
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
  imgStyle,
  width,
  maxwidth = "1024px",
  directory,
  height = "50%",
  page,
  translate, 
  ...other
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
        imgStyle={imgStyle}
        maxWidth={maxwidth}
        page={page}
        t={translate("Index")}
        coverclassname={coverclassname} 
        {...other}
      />
    );
  return null;
};

export default withTheme(FrontCarousel);
