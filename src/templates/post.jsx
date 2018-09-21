import React from "react";
import Helmet from "react-helmet";
import { graphql } from "gatsby";
import RehypeReact from 'rehype-react';
import { translate } from "utils/i18n"; 
import Card from "react-md/lib/Cards";
import CardText from "react-md/lib/Cards/CardText";
import Layout from "../layout";
import UserInfo from "../components/UserInfo";
import Disqus from "../components/Disqus";
import PostTags from "../components/PostTags";
//import PostCover from "../components/PostCover";
import PostInfo from "../components/PostInfo";
import FrontCarousel from "../components/FrontCarousel";
import SocialLinks from "../components/SocialLinks";
import PostSuggestions from "../components/PostSuggestions";
import SEO from "../components/SEO";
import config from "../../data/SiteConfig";
import "./b16-tomorrow-dark.css";
import "./post.scss";

const renderAst = new RehypeReact({
  createElement: React.createElement,
  components: {
      'imgtest': FrontCarousel,
  },
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
    const { slug, route, lng } = this.props.pageContext;
    global.filesQuery=this.props.data.allFile.edges;
    console.log("postthis", this.props);
    const expanded = !mobile;
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

    const coverHeight = mobile ? 180 : 350;
    return (
      <Layout
        location={this.props.location}
        route={route}
        t={this.props.t}
        lng={lng}
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
            translate={this.props.t}
          />
          {carouselList.length > 0 && (
            <FrontCarousel
              width="150px"
              directory={directory}
              data={carouselList}
              coverClassName="md-grid md-cell--9 post-cover"
            />
          )}

          <div className="md-grid md-cell--12 post-page-contents mobile-fix">
            <Card className="md-grid md-cell md-cell--12 post">
              <CardText className="post-body">
                <h1 className="md-display-2 post-header">{post.title}</h1>
                <PostInfo postNode={postNode} carouselList={carouselList} lang={lng} />
                {
                    renderAst(postNode.htmlAst)
                }
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

export default translate(["Post", "common"])(PostTemplate);

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


//<div dangerouslySetInnerHTML={{ __html: postNode.html }} />