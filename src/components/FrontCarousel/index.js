import React from "react";
import Img, { calculImg } from "gatsby-image";
import { Link, navigate } from "gatsby";
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
  const ismain = page === "/";
  const lng = t("lang");
  const dir = directory !== "" ? "/" + directory : "";
  let heightCarousel = height ? height : "50%";
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
  const linkPrimary = route.router["/instructor/"][lng];
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
              className="h3 md-grid md-cell md-cell--12 md-cell--6-tablet md-cell--3-phone"
            >
              {t("main1")}
            </span>
            <div className="h4">
              <span className="strictly-desktop">{t("main2")}</span>
              <Button
                className="bgsecondary md-cell md-cell--5 md-cell--4-tablet md-cell--4-phone btn-left"
                icontoend
                icon="thumbs-up black"
                type="awesome"
                onClick={() => navigate(linkPrimary)}
              >
                <Link to={linkPrimary} className="h4 primary">
                  Get Started{" "}
                </Link>
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
    else return process.env.NODE_ENV === "development" ? "NOCOVER" : "";
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
