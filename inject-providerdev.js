import React, { Component } from "react";
import i18n from "i18next";
import AppRegistry from "./src/react-native-web/src/exports/AppRegistry";
import { ThemeContext } from "./src/withContext";
function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep(fn, ...args) {
  await timeout(3000);
  return fn(...args);
}

global.M = undefined;
const getLanguage = () =>
  i18n.language ||
  (typeof window !== "undefined" && window.localStorage.i18nextLng);

const filetranslate = lng => import(`./src/layouts/translate_${lng}`);
const MAsync = () =>
  import(/* webpackChunkName: "materialize" */ "./src/components/materialize");
const chatAsync = () => import(/* webpackChunkName: "chat" */ "./src/chat");

global.locale = { en: [], ru: [], pt: [], uk: [], ch: [], fr: [] };
global.menuList = { en: [], ru: [], pt: [], uk: [], ch: [], fr: [] };
global.filesQuery = [];
const preferDefault = m => (m && m.default) || m;
let Layout;
try {
  Layout = preferDefault(require(GATSBY_LAYOUT_COMPONENT_PATH));
} catch (e) {
  if (e.toString().indexOf(`Error: Cannot find module`) !== -1) {
    throw new Error(
      `Couldn't find layout component at "${GATSBY_LAYOUT_COMPONENT_PATH}.\n\n` +
        `Please create layout component in that location or specify path to layout component in gatsby-config.js`
    );
  } else {
    throw e;
  }
}
export const onClientEntry = async () => {
  if (!global.M) {
    const Zep = await MAsync();
    global.M = Zep.default;
  }

  if (/comp|inter|loaded/.test(document.readyState)) {
    Waves.displayEffect();
    M.startTextFields()
  } else {
    document.addEventListener(
      "DOMContentLoaded",
      function() {
        M.startTextFields()
        Waves.displayEffect();
      },
      false
    );
  }
};

export const replaceHydrateFunction = () => {
  return (element, container, callback) => {
    // const el=element.children?;
    class App extends Component {
      render() {
        return <div id="App">{element}</div>;
      }
    }

    AppRegistry.registerComponent("App", () => App);
    AppRegistry.runApplication("App", {
      initialProps: {},
      rootTag: container,
      callback
    });
  };
};
global.Chat = undefined;
class App extends Component {
  constructor() {
    super();
    this.state = {
      Chat: false
    };
  }
  async componentDidMount() {
    if (!global.Chat) {
      const Chat = await sleep(chatAsync);
      global.Chat = Chat.default;
      this.setState({ Chat: true })
    }
  }

  render() {
    const Chat = global.Chat;
    console.log("Chatsleep", this.props.location);
    return (
      <div>
        <Layout>{this.props.children}</Layout>
        {this.state.Chat && <Chat location={this.props.location} />}
      </div>
    );
  }
}

export const wrapPageElement = async ({ element, props }) => {
  const { lng } = props.pageContext;
  console.log("wrapPageElement", props);
  i18n.changeLanguage(lng);
  if (!lng)
    return (
      <>
        <div />
        <App location={props.location}>{element}</App>
      </>
    );
  let Red, Red2;
  if (global.menuList[lng].length == 0) {
    try {
      const Obj = await filetranslate(lng);
      Red = Obj.default;
    } catch (e) {
      Red = "div";
    }
  } else {
    console.log("dev", global.locale);
    global.locale[lng].forEach(({ node }) => {
      const { lng, ns, data } = node;
      if (!i18n.hasResourceBundle(lng, ns)) {
        i18n.addResources(lng, ns, JSON.parse(data));
      }
    });
    Red = "div";
  }

  console.log("postNodeBefrunMainNavLayout");
  return (
    <>
      <Red />
      <App lng={lng} location={props.location}>
        {element}
      </App>
    </>
  );
};

const stateProvider = {
  translate: namespace => i18n.getFixedT(null, [namespace, "common"])
};
export const wrapRootElement = ({ element }) => {
  return (
    <ThemeContext.Provider value={stateProvider}>
      {element}
    </ThemeContext.Provider>
  );
};
