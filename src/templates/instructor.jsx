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
import PostCover from "../components/PostCover";
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
    const { slug } = this.props.pageContext;
    console.log("postthis", this.props);
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

    const coverHeight = mobile ? 180 : 350; 
    return (
      <Layout location={this.props.location}>
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
          {post.cover && (
            <PostCover
              postNode={postNode}
              coverHeight={coverHeight}
              coverClassName="md-grid md-cell--9 post-cover"
            />
          )}
          <div
            className="md-grid post-page-contents mobile-fix"
          >
            <Card className="md-grid md-cell md-cell--12 post">
              <CardText className="post-body">
          
                <h1 className="md-display-2 post-header">{post.title}</h1>
                <PostInfo postNode={postNode} />
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
  query InstructorPostBySlug($id: String!, $lng: String!) {
    locales: allLocale(filter: { lng: { eq: $lng } }) {
      ...LocaleFragment
    }
    markdownRemark(id: { eq: $id }) {
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
        slug
        lng
        date
      }
    }
  }
`;