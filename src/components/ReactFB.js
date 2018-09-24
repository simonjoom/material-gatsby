import React, { PureComponent } from "react";
const isMobile = true;

function insertFB(language, appId, callback) {
  const lg =
    language == "ru"
      ? "ru_RU"
      : language == "fr"
        ? "fr_FR"
        : language == "pt"
          ? "pt_BR"
          : language == "uk"
            ? "uk_UA"
            : "en_GB";

  var getScript = function(src, id, func) {
    var script = document.createElement("script");
    script.async = "async";
    script.src = src;
    script.id = id;
    if (func) {
      script.onload = func;
    }
    document.getElementsByTagName("head")[0].appendChild(script);
  };
  getScript(
    `//connect.facebook.net/${lg}/all.js#xfbml=1&version=v2.10&appId=${appId}`,
    "facebook-jssdk",
    callback
  );
}
class ReactFB extends PureComponent {
  componentWillMount() {
    this.newDivName =
      this.props.newDivName ||
      "fb" + this.props.type + String(new Date().valueOf());
  }

  componentDidMount() {
    const { language, appId } = this.props;
    if (!global.FB && document && !document.getElementById("facebook-jssdk")) {
      insertFB(language, appId, () => {
        console.log("FB.loaded", global.FB);
        global.FB.XFBML.parse(document.getElementById(this.newDivName));
      });
      global.doneFB = true;
    } else {
      global.FB.XFBML.parse(document.getElementById(this.newDivName));
    }
  }

  render() {
    const {
      href,
      layout,
      action,
      size,
      share,
      showFaces,
      reference,
      width,
      colorscheme,
      kidDirectedSite,
      style,
      postId,
      desc,
      comp
    } = this.props;
    console.log("renderFB", this.props.type);
    let mpost = postId + "?" + Math.floor(Math.random() * 10000 + 1) + "";
    if (this.props.type == "page")
      return (
        <div
          className="fbpage"
          id={this.newDivName}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <div
            className="fb-page"
            style={{ display: "block", width: isMobile ? 350 : 500 }}
            data-href="https://www.facebook.com/Skicckool/"
            data-tabs="timeline"
            data-width={isMobile ? 350 : 500}
            data-height="600"
            data-small-header="false"
            data-adapt-container-width="true"
            data-hide-cover="false"
            data-show-facepile="true"
          >
            <blockquote
              cite="https://www.facebook.com/Skicckool/"
              className="fb-xfbml-parse-ignore"
            >
              <a href="https://www.facebook.com/Skicckool/">
                Skiscool Pусскоговорящий Лыжный инструктор Куршевель
              </a>
            </blockquote>
          </div>
        </div>
      );
    else if (this.props.type == "post")
      return (
        <div
          className="fbpost"
          id={this.newDivName}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <div
            className="fb-post"
            style={{ display: "block", width: isMobile ? 350 : 500 }}
            data-href={`https://www.facebook.com/Skicckool/posts/${mpost}`}
            data-show-text="true"
            data-width={isMobile ? 350 : 500}
            data-height="600"
          >
            <blockquote
              cite={`https://fr-fr.facebook.com/Skicckool/posts/${mpost}:0`}
              className="fb-xfbml-parse-ignore"
            >
              <p>{desc}</p>
              Publié par{" "}
              <a href="https://www.facebook.com/Skicckool/">
                Skiscool Pусскоговорящий Лыжный инструктор Куршевель
              </a>{" "}
              sur&nbsp;
              <a href={`https://fr-fr.facebook.com/Skicckool/posts/${mpost}:0`}>
                mardi 17 janvier 2017
              </a>
            </blockquote>
          </div>
        </div>
      );
    else
      return (
        <div className="fblike" id={this.newDivName}>
          <div
            className="fb-like"
            style={style}
            data-href={href}
            data-layout={layout}
            data-size={size}
            data-show-faces={showFaces}
            data-share={share}
            data-width={width}
            data-ref={reference}
            data-colorscheme={colorscheme}
            data-kid-directed-site={kidDirectedSite}
          />
        </div>
      );
  }
}
ReactFB.defaultProps = {
  language: "en",
  postId: "1347567485317204",
  layout: "standard",
  action: "like",
  size: "small",
  share: true,
  showFaces: true,
  type: "like",
  colorscheme: "light",
  kidDirectedSite: false
};
export default ReactFB;
