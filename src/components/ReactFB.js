import React, { PureComponent } from "react";
const isMobile = true;
let io;
const listeners = [];
function getIO() {
  if (
    typeof io === "undefined" &&
    typeof window !== "undefined" &&
    window.IntersectionObserver
  ) {
    io = new window.IntersectionObserver(
      function(entries) {
        entries.forEach(function(entry) {
          listeners.forEach(function(l) {
            if (l[0] === entry.target) {
              // Edge doesn't currently support isIntersecting, so also test for an intersectionRatio > 0
              if (entry.isIntersecting || entry.intersectionRatio > 0) {
                io.unobserve(l[0]);
                l[1]();
              }
            }
          });
        });
      },
      {
        rootMargin: "200px"
      }
    );
  }

  return io;
}

var listenToIntersections = function listenToIntersections(el, cb) {
  getIO().observe(el);
  listeners.push([el, cb]);
};

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
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false
    };
    if (typeof window !== "undefined" && window.IntersectionObserver) {
      this.IOSupported = true;
    }
  }
  componentWillMount() {
    this.newDivName =
      this.props.newDivName ||
      "fb" + this.props.type + String(new Date().valueOf());
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.isVisible !== this.state.isVisible) {
      global.FB.XFBML.parse(document.getElementById(this.newDivName));
    }
  }
  handleRef = ref => {
    console.log("handleRef", ref);
    var _this2 = this;
    if (ref) {
      if (this.IOSupported) {
        listenToIntersections(ref, function() {
          const { language, appId } = _this2.props;
          if (
            !global.FB &&
            document &&
            !document.getElementById("facebook-jssdk")
          ) {
            insertFB(language, appId, () => {
              _this2.setState({
                isVisible: true
              });
              console.log("FB.loaded", global.FB);
            });
            global.doneFB = true;
          } else {
            _this2.setState({
              isVisible: true
            });
          }
        });
      } else {
        if (
          !global.FB &&
          document &&
          !document.getElementById("facebook-jssdk")
        ) {
          insertFB(language, appId, () => {
            _this2.setState({
              isVisible: true
            });
          });
          global.doneFB = true;
        }
      }
    }
  };

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
          ref={this.handleRef}
        >
          {this.state.isVisible && (
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
          )}
        </div>
      );
    else if (this.props.type == "post")
      return (
        <div
          className="fbpost"
          id={"fbpost" + this.newDivName}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
          ref={this.handleRef}
        >
          {this.state.isVisible && (
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
                <a
                  href={`https://fr-fr.facebook.com/Skicckool/posts/${mpost}:0`}
                >
                  mardi 17 janvier 2017
                </a>
              </blockquote>
            </div>
          )}
        </div>
      );
    else
      return (
        <div
          className="fblike"
          id={"fblike" + this.newDivName}
          ref={this.handleRef}
        >
          {this.state.isVisible && (
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
          )}
        </div>
      );
  }
}
ReactFB.defaultProps = {
  language: "en",
  appId: "562112907171338",
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
