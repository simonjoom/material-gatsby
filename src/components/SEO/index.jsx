import React, { Component } from "react";
import Helmet from "react-helmet";
import urljoin from "url-join";
const config = require("../../data/SiteConfig" + process.env.LANG);

const siteUrlfr = "https://www.skiscool.fr";
const siteUrlen = "https://www.ski-courchevel.deals";
const siteUrlpt = "https://pt.skiscool.com";
const siteUrluk = "https://uk.skiscool.com";
const siteUrlru = "https://www.skiscool.com";
const siteUrlch = "https://cn.skiscool.com";
const pathPrefix = "";
class SEO extends Component {
  render() {
    const {
      postNode,
      postPath,
      postSEO,
      translate,
      route,
      title: titleprop
    } = this.props;
    let description;
    let image;
    let title;
    let postURL;
    /* let routefr, routeen, routeuk, routept, routeru, routech;
    if (route && route.fr) {
      routefr = route.fr.replace("/fr", "");
      routeen = route.en.replace("/en", "");
      routeuk = route.uk.replace("/uk", "");
      routept = route.pt.replace("/pt", "");
      routeru = route.ru.replace("/ru", "");
      routech = route.cn.replace("/cn", "");
    } else {
      console.warn("noroute", postNode);
    } */
    if (postSEO) {
      const postMeta = postNode.frontmatter;
      if (!titleprop) ({ title } = postMeta);
      else title = titleprop;
      description = postMeta.description
        ? postMeta.description
        : postNode.excerpt;
      image = postMeta.cover || "";
      postURL = urljoin(translate("siteUrl"), pathPrefix, postPath);
    } else {
      title = titleprop || config.siteTitle;
      description = config.siteDescription;
      image = config.siteLogo;
    }
    image = urljoin(config.siteUrl, pathPrefix, image);
    const blogURL = urljoin(translate("siteUrl"), pathPrefix);
    const schemaOrgJSONLD = [
      {
        "@context": "http://schema.org",
        "@type": "WebSite",
        url: blogURL,
        name: title,
        alternateName: config.siteTitleAlt ? config.siteTitleAlt : ""
      }
    ];
    if (postSEO) {
      schemaOrgJSONLD.push([
        {
          "@context": "http://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              item: {
                "@id": postURL,
                name: title,
                image
              }
            }
          ]
        },
        {
          "@context": "http://schema.org",
          "@type": "BlogPosting",
          url: blogURL,
          name: title,
          alternateName: config.siteTitleAlt ? config.siteTitleAlt : "",
          headline: title,
          image: {
            "@type": "ImageObject",
            url: image
          },
          description
        }
      ]);
    }
    return (
      <Helmet>
        <title>{`${translate(title)} | ${config.siteTitle}`}</title>
        <link rel="canonical" href={`${siteUrlfr}${route.fr}`} />
        <link rel="canonical" href={`${siteUrlen}${route.en}`} />
        <link rel="canonical" href={`${siteUrlpt}${route.pt}`} />
        <link rel="canonical" href={`${siteUrluk}${route.uk}`} />
        <link rel="canonical" href={`${siteUrlru}${route.ru}`} />
        <link rel="canonical" href={`${siteUrlch}${route.cn}`} />
        {/* General tags */}
        <meta name="description" content={description} />
        <meta name="image" content={image} />

        {/* Schema.org tags */}
        <script type="application/ld+json">
          {JSON.stringify(schemaOrgJSONLD)}
        </script>

        {/* OpenGraph tags */}
        <meta property="og:url" content={postSEO ? postURL : blogURL} />
        {postSEO ? <meta property="og:type" content="article" /> : null}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta
          property="fb:app_id"
          content={config.siteFBAppID ? config.siteFBAppID : ""}
        />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:creator"
          content={config.userTwitter ? config.userTwitter : ""}
        />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </Helmet>
    );
  }
}

export default SEO;
