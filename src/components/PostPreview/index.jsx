import React, { Component } from "react";
import Card from "react-md/lib/Cards/Card";
import CardTitle from "react-md/lib/Cards/CardTitle";
import Button from "react-md/lib/Buttons";
import FrontCarousel from "components/FrontCarousel";
import Avatar from "react-md/lib/Avatars";
import CardText from "react-md/lib/Cards/CardText";
import FontIcon from "react-md/lib/FontIcons";
import { Link } from "gatsby";
import moment from "moment";
import Media, { MediaOverlay } from "react-md/lib/Media";
import PostTags from "../PostTags";
//import PostCover from "../PostCover";
import config from "../../../data/SiteConfig";
import "./PostPreview.scss";

class PostPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: true
    };
    this.handleResize = this.handleResize.bind(this);
  }
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
  }
  render() {
    const { postInfo, size } = this.props;
    const { mobile } = this.state;
    const { carouselList, type } = postInfo;
    const expand = true;
    /* eslint no-undef: "off" */
    const coverHeight = mobile ? 162 : 200;
    console.log("preview", carouselList, type);
    return (
      <Card
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
                <Button raised secondary className="md-cell--right">
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
      </Card>
    );
  }
}

export default PostPreview;

//<PostCover postNode={postInfo} coverHeight={coverHeight} />
