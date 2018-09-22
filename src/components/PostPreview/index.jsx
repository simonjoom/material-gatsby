import React, { Component } from "react";
//import Card from "react-md/lib/Cards/Card";
//import CardTitle from "react-md/lib/Cards/CardTitle";
//import Button from "react-md/lib/Buttons";
import FrontCarousel from "components/FrontCarousel";
import Avatar from "react-md/lib/Avatars";
//import CardText from "react-md/lib/Cards/CardText";
import FontIcon from "react-md/lib/FontIcons";
import { Link } from "gatsby";
import moment from "moment";
//import Media, { MediaOverlay } from "react-md/lib/Media";
import PostTags from "../PostTags";
//import PostCover from "../PostCover";
import config from "../../../data/SiteConfig";
import Card from "../../reactLIB/Card";
//import CardTitle from "../../reactLIB/CardTitle";
import Icon from "../../reactLIB/Icon";
import "./PostPreview.scss";

class PostPreview extends Component {
  constructor(props) {
    super(props);
    /*this.state = {
      mobile: true
    };*/
    //this.handleResize = this.handleResize.bind(this);
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
  }*/
  render() {
    const { postInfo, size } = this.props;
    const Button = global.Button;
    //  const { mobile } = this.state;
    const { carouselList, type } = postInfo;
    const expand = true;
    /* eslint no-undef: "off" */
    const coverHeight = 200;
    // console.log("preview", carouselList, type);
    return (
      <Card
        key={postInfo.path}
        waves="light"
        className={`md-cell md-cell--12-phone md-cell--${size} md-cell--4-tablet`}
        contentImage={
          carouselList.length > 0 && (
            <FrontCarousel
              data={carouselList}
              height="0"
              directory={type}
            />
          )
        }
        titlereveal={postInfo.title}
        title={
          <Link style={{ textDecoration: "none" }} to={postInfo.path}>
            <Avatar icon={<Icon className="calendar" />} />
            {postInfo.title}
            <Button className="btn md-cell--right">Read </Button>
          </Link>
        }
        imgtitle={
          <div>
            Published on {`${moment(postInfo.date).format(config.dateFormat)}`}
          </div>
        }
        reveal={
          <>
            <div
              dangerouslySetInnerHTML={{ __html: window ? postInfo.html : "" }}
            />
            <PostTags tags={postInfo.tags} />
          </>
        }
      >
        {postInfo.excerpt}
      </Card>
    );
  }
}

export default PostPreview;

//<PostCover postNode={postInfo} coverHeight={coverHeight} />
/*<Card
        key={postInfo.path}
        raise
        className={`md-grid md-cell md-cell--${size}`}
      >
        <Link style={{ textDecoration: "none" }} to={postInfo.path}>
          <Media
            style={{
              height: coverHeight,
              paddingBottom: "0px",
              display: "flex"
            }}
          >
            {carouselList.length > 0 && (
              <FrontCarousel
                data={carouselList}
                directory={type}
                coverClassName="md-grid md-cell--9 post-cover"
              />
            )}
            <MediaOverlay>
              <CardTitle title={postInfo.title}>
                <Button className="btn md-cell--right">
                  Read
                </Button>
              </CardTitle>
            </MediaOverlay>
          </Media>
        </Link>
        <CardTitle
          expander={expand}
          avatar={<Avatar icon={<FontIcon iconClassName="fa fa-calendar" />} />}
          title={`Published on ${moment(postInfo.date).format(
            config.dateFormat
          )}`}
          subtitle={`${postInfo.timeToRead} min read`}
        />

        <CardText expandable={expand}>
          {postInfo.excerpt}
          <PostTags tags={postInfo.tags} />
        </CardText>
      </Card>*/
