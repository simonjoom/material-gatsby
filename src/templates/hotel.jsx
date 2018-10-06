import React from "react";
import { graphql, Link } from "gatsby";
import { kebabCase } from "lodash";
import moment from "moment";
import Avatar from "../components/Avatars";
import withTheme from "../withContext";
import Card from "../reactLIB/Card";
import Icon from "../reactLIB/Icon";
import PostTags from "../components/PostTags";
import FrontCarousel from "../components/FrontCarousel";
import SocialLinks from "../components/SocialLinks";
import Layout from "../components/Layout";
import PostSuggestions from "../components/PostSuggestions";
import SEO from "../components/SEO";
import config from "../data/SiteConfig";
import "./b16-tomorrow-dark.css";
import "./post.scss";

class HotelTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: true
    };
    this.Mynode = ({ star }) => (
      <div
        className="center"
        style={{
          color: "white",
          position: "absolute",
          zIndex: "1",
          width: "100%"
        }}
      >
        <span>
          SkiScool <i className="fa fa-copyright" />
        </span>
        <div>
          {Array.from(new Array(star),a => (
            <i className="yellow-text fa fa-star" />
          ))}
        </div>
      </div>
    );
  }

  render() {
    const { mobile } = this.state;
    const { translate: t } = this.props;
    const { slug, lng, route, slugbase, files } = this.props.pageContext;
    global.filesQuery = files;
    const expanded = !mobile;
    // const postOverlapClass = mobile ? "post-overlap-mobile" : "post-overla";
    const postNode = this.props.data.markdownRemark;
    const post = postNode.frontmatter;
    if (!post.id) {
      post.id = slug;
    }
    if (!post.category_id) {
      post.category_id = config.postDefaultCategoryID;
    }
    const directory = postNode.fields.type;
    const carouselList = post.cover ? [post.cover] : [];
    return (
      <Layout
        carouselList={carouselList}
        route={route}
        lng={lng}
        ismain={false}
        location={this.props.location}
      >
        <div className="post-page md-grid">
          <SEO
            postPath={slug}
            route={route}
            postNode={postNode}
            postSEO
            translate={t("Index")}
          />
          <div className="md-grid post-page-contents mobile-fix">
            <Card
              className="md-cell md-cell--12-phone md-cell--12 post md-cell--12-tablet"
              waves="light"
              contentImage={
                <div>
                  {postNode.fields.star && (
                    <this.Mynode star={postNode.fields.star} />
                  )}
                  {carouselList.length > 0 && (
                    <FrontCarousel
                      data={carouselList}
                      directory={directory}
                      height="0"
                      maxwidth="600px"
                    />
                  )}
                </div>
              }
              titlereveal={post.title}
              imgtitle={
                <div>
                  <Avatar icon={<Icon className="calendar" />} />
                  Published on{" "}
                  {`${moment(postNode.fields.date).format(config.dateFormat)}`}
                </div>
              }
              title={
                <Link
                  className="category-link"
                  to={`/categories_${lng}/${kebabCase(post.category)}`}
                >
                  <Avatar icon={<Icon className="folder-open" />} />
                  {post.title} In category {post.category}
                </Link>
              }
            >
              <div className="post-meta">
                <PostTags tags={post.tags} />
                <SocialLinks
                  postPath={slug}
                  postNode={postNode}
                  mobile={this.state.mobile}
                />
              </div>

              <div dangerouslySetInnerHTML={{ __html: postNode.html }} />
              {post.excerpt}
            </Card>
          </div>

          <PostSuggestions postNode={postNode} />
        </div>
      </Layout>
    );
  }
}

export default withTheme(HotelTemplate);

export const pageQuery = graphql`
  query HotelPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      timeToRead
      excerpt
      frontmatter {
        title
        description
        cover
        date
        category
        tags
      }
      fields {
        nextTitle
        nextSlug
        prevTitle
        prevSlug
        type
        slug
        star
        lng
        date
      }
    }
  }
`;
