import React from "react";
import { graphql, Link } from "gatsby";
import { kebabCase } from "lodash";
import parse from "date-fns/parse";
import format from "date-fns/format"
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
          {Array.from(new Array(star), a => (
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
    const postNode = this.props.data.markdownRemark;
    const post = postNode.frontmatter;
    if (!post.id) {
      post.id = slug;
    }
    if (!post.category_id) {
      post.category_id = config.postDefaultCategoryID;
    }
    const date=format(parse(postNode.fields.date), config.dateFormat);
    const directory = postNode.fields.type;
    const carouselList = post.cover ? [post.cover] : [];
    return (
      <Layout
        carouselList={carouselList}
        route={route}
        lng={lng}
        page={slugbase}
        location={this.props.location}
      >
        <div className="post-page md-grid md-grid--stacked">
          <SEO
            postPath={slug}
            route={route}
            postNode={postNode}
            postSEO
            translate={t("Index")}
          />
          <Card
            className="md-cell md-cell--12-phone md-cell--10 md-cell--8-tablet mobile-fix"
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
                {date}
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
