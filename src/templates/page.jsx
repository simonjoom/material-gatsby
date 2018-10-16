import React from "react";
import RehypeReact from "rehype-react";
import { graphql } from "gatsby";
//import UserInfo from "../components/UserInfo";
import withTheme from "../withContext";
import PostTags from "../components/PostTags";
import Layout from "../components/Layout";
//import PostInfo from "../components/PostInfo";
import SocialLinks from "../components/SocialLinks";
import Card from "../reactLIB/Card";
const config = require("../data/SiteConfig"+process.env.LANG);
import FrontCarousel from "../components/FrontCarousel";
import SEO from "../components/SEO";
import ReactFB from "../components/ReactFB";
import Email from "../components/Email"; 
import ButtonT from "../components/Button";

const renderAst = new RehypeReact({
  createElement: React.createElement,
  components: {
    imgtest: FrontCarousel,
    reactfb: ReactFB,
    email: Email,
    buttontest: ButtonT
  }
}).Compiler;

class PageTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: true
    };
  }

  render() {
    const { mobile } = this.state;
    const { translate: t } = this.props;
    const {
      slug,
      slugbase,
      route,
      lng,
      carousel,
      files
    } = this.props.pageContext;
    global.filesQuery = files;
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
      post.category_id = config.postDefaultCategoryID;
    } 
    const title = t("index")(post.title);
    //render current markdownRemark
    return (
      <Layout
        carouselList={carouselList}
        route={route}
        lng={lng}
        page={slugbase}
        location={this.props.location}
      >
        <SEO
          postPath={slug}
          route={route}
          postNode={postNode}
          postSEO
          translate={t("Index")}
        />

        <Card className="post">
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
      </Layout>
    );
  }
}

export default withTheme(PageTemplate);

export const pageQuery = graphql`
  query PagesBySlug($slug: String!, $lng: String!) {
    markdownRemark(fields: { slug: { eq: $slug }, lng: { eq: $lng } }) {
      htmlAst
      timeToRead
      excerpt
      rawMarkdownBody
      frontmatter {
        title
        description
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

/*   {slug == "/" && (
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
         } */
