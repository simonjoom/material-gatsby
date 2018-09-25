import React, { Component } from "react";
import { View, Text } from "react-native";
import { Link } from "gatsby";
import Button from "../../reactLIB/Button";
import Icon from "../../reactLIB/Icon";
import UserLinks from "../UserLinks";
import config from "../../../data/SiteConfig";
import "./Footer.scss";

class Footer extends Component {
  render() {
    const url = config.siteRss;
    const { userLinks } = this.props;
    const { copyright, fixedFooter } = config;
    if (!copyright) {
      return null;
    }
    return (
      <footer className={fixedFooter ? "footer footer-fixed" : "footer"}>
        {userLinks ? <UserLinks config={config} labeled /> : null}

        <View className="notice-container">
          <View className="contact-us">
            <Text className="contact-item">
              <Icon className="phone" /> Call Us: +33 6 75 505209{" "}
            </Text>
            <Text className="contact-item">
              <Icon className="envelope" /> e-mail us: simon@skiscool.com
            </Text>
          </View>
          <div className="c1 c5 c2 py2 fit center mx-auto">
            <img src="https://skiscool.com/dist/baton1024.jpg" />
            <img src="https://skiscool.com/dist/tripadvisor.jpg" />
          </div>
          <div
            id="ime"
            className="flex flex-wrap justify-center relative py2 fit center mx-auto image-section-two"
          >
            <img src="https://skiscool.com/dist/pic/courchevel.jpg" />
            <img src="https://skiscool.com/dist/pic/apogee.jpg" />
            <img src="https://skiscool.com/dist/pic/davidcintract.jpg" />
          </div>
        </View>
        <div className="bottom-section">
          {userLinks ? <UserLinks config={config} labeled /> : null}

          <div className="rss">
            <Link to={url}>
              <Button flat secondary className="fa fa-rss">
                Subscribe
              </Button>
            </Link>
          </div>

          <div className="based-on">
            <h4>
              Based on{" "}
              <a href="https://github.com/simonjoom/material-gatsby">
                Gatsby SkiScool
              </a>
              .
            </h4>
          </div>

          <div className="copyright">
            <h4>{copyright}</h4>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
