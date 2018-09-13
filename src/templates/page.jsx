import React from "react";
import Helmet from "react-helmet";
import { graphql, Link } from "gatsby";
import { translate } from "utils/i18n";
import Card from "react-md/lib/Cards";
import CardText from "react-md/lib/Cards/CardText";
import Layout from "../layout";
import UserInfo from "../components/UserInfo";
import Disqus from "../components/Disqus";
import PostTags from "../components/PostTags";
import LanguageSwitcher from "../components/Switchlang";
import PostInfo from "../components/PostInfo";
import SocialLinks from "../components/SocialLinks";
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
    const { mobile } = this.state;
    const { slug, route } = this.props.pageContext;
    console.log("postthis", this.props);
    const expanded = !mobile;

    //generate Menu from allMarkdownRemark
    const postEdges = this.props.data.allMarkdownRemark.edges;
    let postList = [];
    postEdges.forEach(postEdge => {
      //console.log("testslug", postEdge.node.fields.slug);
      const title = this.props.t(postEdge.node.frontmatter.title);
      postList.push({
        path: postEdge.node.fields.slug,
        title
      });
    });
    ///

    //render current markdownRemark
    const postNode = this.props.data.markdownRemark;
    const post = postNode.frontmatter;
    if (!post.id) {
      post.id = slug;
    }
    if (!post.category_id) {
      post.category_id = config.postDefaultCategoryID;
    }
    const title = this.props.t(post.title);
    //render current markdownRemark
    return (
      <Layout location={this.props.location}>
        <LanguageSwitcher route={route} />
        <div className="post-page md-grid md-grid--no-spacing">
          <Helmet>
            <title>{`${title} | ${config.siteTitle}`}</title>
            <link rel="canonical" href={`${config.siteUrl}${post.id}`} />
          </Helmet>

          {postList.map(post => (
            <Link style={{ textDecoration: "none" }} to={post.path}>
              {post.title}
            </Link>
          ))}
          <SEO
            postPath={slug}
            postNode={postNode}
            postSEO
            translate={this.props.t}
          />
          <Card className="md-grid md-cell md-cell--12 post">
            <CardText className="post-body">
              <h1 className="md-display-2 post-header">{title}</h1>
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
      </Layout>
    );
  }
}

export default translate(["common"])(PostTemplate);

export const pageQuery = graphql`
  query PagesBySlug($id: String!, $lng: String!) {
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
        slug
        lng
        date
      }
    }
    allMarkdownRemark(
      limit: 2000
      filter: { fields: { lng: { eq: $lng }, type: { eq: "pages" } } }
      sort: { fields: [fields___date], order: DESC }
    ) {
      edges {
        node {
          html
          timeToRead
          excerpt
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`;
