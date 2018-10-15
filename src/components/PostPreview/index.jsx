import React, { Component } from "react";
import { Link } from "gatsby";
import parse from "date-fns/parse";
import format from "date-fns/format";
import FrontCarousel from "components/FrontCarousel";
import Avatar from "../Avatars";
import Button from "../../reactLIB/Button";
// import Media, { MediaOverlay } from "react-md/lib/Media";
import PostTags from "../PostTags";
// import PostCover from "../PostCover";
import config from "../../data/SiteConfig";
import Card from "../../reactLIB/Card";
import Icon from "../../reactLIB/Icon";
import "./PostPreview.scss";

class PostPreview extends Component {
  constructor(props) {
    super(props);
    this.Elextra = this.props.extra;
    /*this.state = {
      mobile: true
    }; */
    // this.handleResize = this.handleResize.bind(this);
  } /*
  componentDidMount() {
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize() {
    if (window.innerWidth >= 640) {
      this.setState({ mobile: false });
    } else {
      this.setState({ mobile: true });
    }
  } */
  render() {
    const { postInfo, size } = this.props;
    //  const { mobile } = this.state;
    const { carouselList, type } = postInfo;
    /* eslint no-undef: "off" */
    const coverHeight = 200;

    const date = format(parse(postInfo.date), config.dateFormat);
    // console.log("preview", carouselList, type);
    return (
      <Card
        key={postInfo.path}
        waves="light"
        className={`md-cell md-cell--12-phone md-cell--${size} md-cell--4-tablet`}
        contentImage={
          <>
            {this.props.star && <this.Elextra star={this.props.star} />}
            {this.props.avatar && (
              <Avatar
                random
                style={{
                  left: 0,
                  right: 0,
                  position: "absolute",
                  zIndex: 1111
                }}
                centered
                iconSized
                icon={
                  <FrontCarousel
                    data={[this.props.avatar]}
                    directory="post"
                    height="0"
                    alt={postInfo.title}
                    maxwidth="80px"
                  />
                }
              />
            )}
            {carouselList.length > 0 && (
              <FrontCarousel
                data={carouselList}
                height="0"
                maxwidth={size > 6 ? "200px" : "600px"}
                directory={type}
              />
            )}
          </>
        }
        titlereveal={postInfo.title}
        title={
          <Link style={{ textDecoration: "none" }} to={postInfo.path}>
            {/* <div style={{ fontSize: "10px" }}><Avatar icon={<Icon className="calendar" />}/>Published on {date}</div> */}
            {postInfo.title}
            <Button className="btn md-cell--right right">Read </Button>
          </Link>
        }
        reveal={
          <div>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  process.env.GATSBY_BUILD_STAGE == "build-html"
                    ? postInfo.html
                    : ""
              }}
            />
            <PostTags tags={postInfo.tags} />
          </div>
        }
      >
        {postInfo.excerpt}
      </Card>
    );
  }
}

export default PostPreview;
