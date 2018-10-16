import React from "react";
import Img, { calculImg } from "gatsby-image";
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
  height,
  t,
  maxWidth = "1024px",
  directory = "",
  ...other
}) => {
  const isContact = page === "/contact/";
  console.log("CarouselQuery", CarouselQuery);
  const ismain = page === "/";
  const lng = t("lang");
  const dir = directory !== "" ? "/" + directory : "";
  let heightCarousel = height ? height : 100;
  const Maptofetch = [];
  dataList.forEach(el => {
    const FileNode = CarouselQuery.find(function(element) {
      return (
        element.node.absolutePath &&
        element.node.absolutePath.indexOf("/static/assets" + dir + "/" + el) !==
          -1
      );
    });
    if (FileNode) {
      const fluid = FileNode.node.childImageSharp.fluid;
      Maptofetch.push({ fluid });
    }
  });
  if (Maptofetch.length > 1) {
    Maptofetch.forEach(el => {
      let car = calculImg(
        el.fluid,
        width,
        height,
        el.fluid.aspectRatio,
        maxWidth
      );
      heightCarousel =
        car.height > heightCarousel ? car.height : heightCarousel;
    });
  }
  const MapImg = Maptofetch.map((el, ind) => (
    <Img
      className={coverclassname}
      key={"I" + ind}
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
              <Button
                className="bgsecondary md-cell"
                icontoend
                icon="thumbs-up black"
                type="awesome"
              >
                <a
                  tabIndex="0"
                  href={route.router["/instructor/"][lng]}
                  className="h4 primary"
                >
                  {" "}
                  Get Started{" "}
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
      fluid={el.fluid}
      height={heightCarousel}
      width={width}
      maxWidth={maxWidth}
      {...other}
    />
  ));

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
  height,
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
