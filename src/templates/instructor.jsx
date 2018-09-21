import React from "react";
import Helmet from "react-helmet";
import { graphql } from "gatsby";
import { translate } from "utils/i18n";
import Card from "react-md/lib/Cards";
import CardText from "react-md/lib/Cards/CardText";
import Layout from "../layout";
import UserInfo from "../components/UserInfo";
import Disqus from "../components/Disqus";
import PostTags from "../components/PostTags";
import FrontCarousel from "../components/FrontCarousel";
import PostInfo from "../components/PostInfo";
import SocialLinks from "../components/SocialLinks";
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
    const { slug, lng, route,slugbase } = this.props.pageContext;
    console.log("route", route);
    const expanded = !mobile;
    // const postOverlapClass = mobile ? "post-overlap-mobile" : "post-overla";
    const postNode = this.props.data.markdownRemark;
    global.filesQuery=this.props.data.allFile.edges;
    console.log("renderindex", postNode.html);
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
        location={this.props.location}
        route={route}
        ismain={slugbase === "/"}
        t={this.props.t}
        lng={lng}
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
            translate={this.props.t}
          />
          {carouselList.length > 0 && (
            <FrontCarousel
              directory={directory}
              data={carouselList}
              coverClassName="md-grid md-cell--9 post-cover"
            />
          )}
 
          <div className="md-grid post-page-contents mobile-fix">
            <Card className="md-grid md-cell md-cell--12 post">
              <CardText className="post-body">
                <h1 className="md-display-2 post-header">{post.title}</h1>
                <PostInfo postNode={postNode} lang={lng} />
                <div dangerouslySetInnerHTML={{ __html: postNode.html }} />
              </CardText>
              <div className="post-meta">
                <PostTags tags={post.tags} />
                <SocialLinks
                  postPath={slug}
                  postNode={postNode}
                  mobile={this.state.mobile}
                />
              </div>
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

export default translate(["Instructor", "common"])(PostTemplate);

export const pageQuery = graphql`
  query InstructorPostBySlug($slug: String!,$lng: String!) {
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
