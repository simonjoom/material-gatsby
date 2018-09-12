import React, { Component } from "react";
import Helmet from "react-helmet";
import { View } from "react-native";
import { graphql } from "gatsby";
import { translate } from "utils/i18n";
import Layout from "../layout";
import About from "../components/About";
import SiteConfig from "../../data/SiteConfig";

class AboutPage extends Component {
  render() {
    const { slug } = this.props.pageContext;
    const siteUrl = this.props.t("siteUrl");
    console.log(slug);
    return (
      <Layout location={this.props.location} title="About">
        <View className="about-container">
          <Helmet>
            <title>{`About | ${SiteConfig.siteTitle}`}</title>
            <link rel="canonical" href={`${siteUrl}${slug}`} />
          </Helmet>
          <About translate={this.props.t} />
        </View>
      </Layout>
    );
  }
}
export default translate(["About", "common"])(AboutPage);

//export default translate('About')(AboutPage)

export const query = graphql`
  query Aboutlng($lng: String!) {
    locales: allLocale(filter: { lng: { eq: $lng }, ns: { eq: "About" } }) {
      ...LocaleFragment
    }
  }
`;

//export default AboutPage;
