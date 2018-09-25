import React from "react";
import RehypeReact from "rehype-react";
import Helmet from "react-helmet";
import { graphql, Link } from "gatsby";
import { View } from "react-native";
//import UserInfo from "../components/UserInfo";
import Disqus from "../components/Disqus";
import withTheme from "../withContext";
import PostTags from "../components/PostTags";
import Layout from "../components/Layout";
//import PostInfo from "../components/PostInfo";
import SocialLinks from "../components/SocialLinks";
import SEO from "../components/SEO";
import Card from "../reactLIB/Card";
import Icon from "../reactLIB/Icon";
import Button from "../reactLIB/Button";
import SiteConfig from "../../data/SiteConfig";
import FrontCarousel from "../components/FrontCarousel";
import ReactFB from "../components/ReactFB";
import "./b16-tomorrow-dark.css";
import "./post.scss";

const renderAst = new RehypeReact({
  createElement: React.createElement,
  components: {
    imgtest: FrontCarousel,
    reactfb: ReactFB
  }
}).Compiler;

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
    const { slug, slugbase, route, lng, carousel,files } = this.props.pageContext;
    global.filesQuery=files; 
    const expanded = !mobile;
    const ismain = slugbase === "/";
    let carouselList = [];
    let background;
    //render current markdownRemark
    const postNode = this.props.data.markdownRemark;
    const post = postNode.frontmatter;
    if (carousel && post.cover) {
      carouselList = post.cover.split(",");
    }
    if (!carousel && post.cover) {
      carouselList[0] = post.cover;
    }
    if (!post.id) {
      post.id = slug;
    }
    if (!post.category_id) {
      post.category_id = SiteConfig.postDefaultCategoryID;
    }
    const title = t("index")(post.title);
    //render current markdownRemark
    return (
      <Layout
        carouselList={carouselList}
        route={route}
        lng={lng}
        ismain={ismain}
        location={this.props.location}
      >
        <Helmet>
          <title>{`${title} | ${SiteConfig.siteTitle}`}</title>
          <link rel="canonical" href={`${SiteConfig.siteUrl}${post.id}`} />
        </Helmet>

        {/*slug == "/" && (
            <View className="rowlink">
              <Link
                primary
                activeStyle={{
                  color: "#ef6091"
                }}
                className="rounded mb1 link1 boxshad"
                to="/Map"
                title="map courchevel meribel val-thorens"
              >
                Map <i className="fa fa-map-signs fa-2x" />
              </Link>
              <Link
                className="ml2 rounded link2 boxshad"
                to="/Instructors"
                title="ski instructors courchevel meribel val-thorens"
              >
                Instructors
                <i className="fa fa-magic fa-2x" />
              </Link>
            </View>
          )<SEO
            postPath={slug}
            postNode={postNode}
            postSEO 
          />
          */}
        <Card className="post" title={title}>
          {renderAst(postNode.htmlAst)}
        </Card>
        <div className="post-meta">
          <PostTags tags={post.tags} />
          <SocialLinks
            postPath={slug}
            postNode={postNode}
            mobile={this.state.mobile}
          />
        </div>
        <Disqus postNode={postNode} expanded={expanded} />
      </Layout>
    );
  }
}

export default withTheme(PostTemplate);

export const pageQuery = graphql`
 
  query PagesBySlug($slug: String!) {
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
        slug
        lng
        date
      }
    }
  }
`;
