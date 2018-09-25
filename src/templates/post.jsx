import React from "react";
import Helmet from "react-helmet";
import { graphql, Link } from "gatsby";
import { kebabCase } from "lodash";
import moment from "moment";
import RehypeReact from "rehype-react";
import Avatar from "react-md/lib/Avatars";
import withTheme from "../withContext";
import UserInfo from "../components/UserInfo";
import Disqus from "../components/Disqus";
import PostTags from "../components/PostTags";
import Layout from "../components/Layout";
// import PostCover from "../PostCover";
import config from "../../data/SiteConfig";
import Card from "../reactLIB/Card";
import Icon from "../reactLIB/Icon";
import Button from "../reactLIB/Button";

//import PostCover from "../components/PostCover";
//import PostInfo from "../components/PostInfo";
import FrontCarousel from "../components/FrontCarousel";
import SocialLinks from "../components/SocialLinks";
import PostSuggestions from "../components/PostSuggestions";
import SEO from "../components/SEO";
import "./b16-tomorrow-dark.css";
import "./post.scss";

const renderAst = new RehypeReact({
  createElement: React.createElement,
  components: {
    imgtest: FrontCarousel
  }
}).Compiler;

class PostTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: true
    };
    //this.handleResize = this.handleResize.bind(this);
  }
  /*
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
*/
  render() {
    const { mobile } = this.state;
    const { translate: t } = this.props;
    const { slug, route, lng } = this.props.pageContext; 
    const postOverlapClass = mobile ? "post-overlap-mobile" : "post-overlap";
    const postNode = this.props.data.markdownRemark;
    const post = postNode.frontmatter;
    const directory = postNode.fields.type;
    const carouselList = post.cover ? [post.cover] : [];
    if (!post.id) {
      post.id = slug;
    }
    if (!post.category_id) {
      post.category_id = config.postDefaultCategoryID;
    }
 
    return (
      <Layout
        carouselList={carouselList}
        route={route}
        lng={lng}
        ismain={false}
        location={this.props.location}
      >
        >
        <div className="post-page md-grid md-grid--no-spacing">
          <Helmet>
            <title>{`${post.title} | ${config.siteTitle}`}</title>
            <link rel="canonical" href={`${config.siteUrl}${post.id}`} />
          </Helmet>
          <SEO
            postPath={slug}
            postNode={postNode}
            postSEO
            translate={t("Post")}
          />
          <div className="md-grid md-cell--12 post-page-contents mobile-fix">
            <Card
              waves="light"
              className="md-cell md-cell--12-phone md-cell--6 md-cell--4-tablet"
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
                <>
                  {renderAst(postNode.htmlAst)}
                  <PostTags tags={post.tags} />
                </>
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
            <UserInfo className="md-grid md-cell md-cell--12" config={config} />
            <Disqus postNode={postNode} />
          </div>

          <PostSuggestions postNode={postNode} />
        </div>
      </Layout>
    );
  }
}

export default withTheme(PostTemplate);

export const postQuery = graphql`
  query PostsBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      htmlAst
      timeToRead
      excerpt
      rawMarkdownBody
      frontmatter {
        title
        cover
        date
        category
        tags
      }
      fields {
        inmenu
        carousel
        nextTitle
        nextSlug
        prevTitle
        prevSlug
        slug
        lng
        date
        type
      }
    }
  }
`;
/*
export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!, $lng: String!) {
    locales: allLocale(filter: { lng: { eq: $lng } }) {
      ...LocaleFragment
    }
    allFile(
            filter: {
          absolutePath:{regex:"/(assets)\/.*\\.(jpg$|png$)/"}
            }
              ) {
                edges {
                  node {
                    id
                    absolutePath
                    childImageSharp {
                      id
                      fluid(maxWidth: 1300) {
                        tracedSVG
                        aspectRatio
                        src
                        srcSet
                        sizes
                        srcWebp
                        srcSetWebp
                        originalName
                      }
                    }
                  }
                }
              }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      htmlAst
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
        slug
        lng
        date
        type
      }
    }
  }
`;
*/
