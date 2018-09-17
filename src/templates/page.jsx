import React from "react";
import Helmet from "react-helmet";
import { graphql, Link } from "gatsby";
import { View } from "react-native";
import { translate } from "utils/i18n";
import Card from "react-md/lib/Cards";
import CardText from "react-md/lib/Cards/CardText";
import Layout from "../layout";
import UserInfo from "../components/UserInfo";
import Disqus from "../components/Disqus";
import PostTags from "../components/PostTags";
import PostInfo from "../components/PostInfo";
import SocialLinks from "../components/SocialLinks";
import SEO from "../components/SEO";
import SiteConfig from "../../data/SiteConfig";
import "./b16-tomorrow-dark.css";
import "./post.scss";
// import FrontCarousel from "../components/FrontCarousel/FrontCarousel"

class PostTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: true
    };
  }

  render() {
    const { mobile } = this.state;
    const { slug, route, lng, carousel } = this.props.pageContext;
    console.log("postthis", this.props);
    const expanded = !mobile;
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
    const title = this.props.t(post.title);
    //render current markdownRemark
    return (
      <Layout
        location={this.props.location}
        route={route}
        t={this.props.t}
        carouselList={carouselList} 
        lng={lng}
      >
        <div className="post-page md-grid md-grid--no-spacing">
          <Helmet>
            <title>{`${title} | ${SiteConfig.siteTitle}`}</title>
            <link rel="canonical" href={`${SiteConfig.siteUrl}${post.id}`} />
          </Helmet>
          {slug == "/" && (
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
          )}
          <SEO
            postPath={slug}
            postNode={postNode}
            postSEO
            translate={this.props.t}
          />
          {/* <Card className="md-grid md-cell md-cell--12 carousel">
            <FrontCarousel/>
          </Card> */}

          <Card className="md-grid md-cell md-cell--12 post">
            <CardText className="post-body">
              <h1 className="md-display-2 post-header">{title}</h1>
              {/* <PostInfo postNode={postNode} lang={lng} /> */}
              <div dangerouslySetInnerHTML={{ __html: postNode.html }} />
            </CardText>
            {/* <div className="post-meta">
              <PostTags tags={post.tags} />
              <SocialLinks
                postPath={slug}
                postNode={postNode}
                mobile={this.state.mobile}
              />
            </div> */}
          </Card>
          {/* <UserInfo
            className="md-grid md-cell md-cell--12"
            config={SiteConfig}
            expanded={expanded}
          />
          <Disqus postNode={postNode} expanded={expanded} /> */}
        </div>
      </Layout>
    );
  }
}

export default translate(["Index","common"])(PostTemplate);

export const pageQuery = graphql`
  query PagesBySlug($slug: String!, $lng: String!) {
    locales: allLocale(filter: { lng: { eq: $lng } }) {
      ...LocaleFragment
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
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

//markdownRemark(id: { eq: $id }) {
//<PostInfo postNode={postNode} lang={lng} />