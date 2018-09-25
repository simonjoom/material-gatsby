import React from "react";
import Helmet from "react-helmet";
import { graphql, Link } from "gatsby";
import { kebabCase } from "lodash";
import moment from "moment";
import Avatar from "react-md/lib/Avatars";
import withTheme from "../withContext";
import Card from "../reactLIB/Card";
import Icon from "../reactLIB/Icon";
import Button from "../reactLIB/Button";
import UserInfo from "../components/UserInfo";
import Disqus from "../components/Disqus";
import PostTags from "../components/PostTags";
import FrontCarousel from "../components/FrontCarousel";
import SocialLinks from "../components/SocialLinks";
import Layout from "../components/Layout";
import PostSuggestions from "../components/PostSuggestions";
import SEO from "../components/SEO";
import config from "../../data/SiteConfig";
import "./b16-tomorrow-dark.css";
import "./post.scss";

class PostTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: true
    };
  }

  render() {
    const { mobile } = this.state;
    const { translate: t } = this.props;
    const { slug, lng, route, slugbase } = this.props.pageContext;
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
          <Helmet>
            <title>{`${post.title} | ${config.siteTitle}`}</title>
            <link rel="canonical" href={`${config.siteUrl}${post.id}`} />
          </Helmet>
          <SEO
            postPath={slug}
            postNode={postNode}
            postSEO
            translate={t("Instructor")}
          />
          <div className="md-grid post-page-contents mobile-fix">
            <Card
              className="md-cell md-cell--12-phone md-cell--12 post md-cell--4-tablet"
              waves="light"
              contentImage={
                carouselList.length > 0 && (
                  <FrontCarousel
                    data={carouselList}
                    directory={directory}
                    height="0"
                    maxwidth="600px"
                  />
                )
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
                  <Button className="btn md-cell--right">Read </Button>
                </Link>
              }
              reveal={
                <div dangerouslySetInnerHTML={{ __html: postNode.html }} />
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
              {post.excerpt}
            </Card>

            <UserInfo
              className="md-grid md-cell md-cell--12"
              config={config}
              expanded={expanded}
            />
            <Disqus postNode={postNode} expanded={expanded} />
          </div>

          <PostSuggestions postNode={postNode} />
        </div>
      </Layout>
    );
  }
}

export default withTheme(PostTemplate);

export const pageQuery = graphql`
  query InstructorPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      timeToRead
      excerpt
      frontmatter {
        title
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
        lng
        date
      }
    }
  }
`;
