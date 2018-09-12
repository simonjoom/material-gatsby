import React, { Component } from "react";
import Helmet from "react-helmet";
import { View } from "react-native";
import Layout from "../layout";
import About from "../components/About";
import config from "../../data/SiteConfig";

class AboutPage extends Component {
  render() {
    return (
      <Layout location={this.props.location} title="About">
        <View className="about-container">
          <Helmet>
            <title>{`About | ${config.siteTitle}`}</title>
            <link rel="canonical" href={`${config.siteUrl}/about/`} />
          </Helmet>
          <About />
        </View>
      </Layout>
    );
  }
}

export default AboutPage;
