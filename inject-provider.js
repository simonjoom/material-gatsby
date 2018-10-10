import React, { Component } from "react";
import i18n from "i18next";
import AppRegistry from "./src/react-native-web/src/exports/AppRegistry";
import { ThemeContext } from "./src/withContext";

global.menuList = window.__INITIAL_STATE__.menuList;
global.filesQuery = window.__INITIAL_STATE__.filesQuery;
global.locale = window.__INITIAL_STATE__.locale;
function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep(fn, ...args) {
  await timeout(3000);
  return fn(...args);
}

/*const initialState = {
  menuList: global.menuList,
  filesQuery: global.filesQuery
};
const preloadedState =window.__INITIAL_STATE__ || initialState; 

const reducermenuList = (state=global.menuList, action) => {
  return state;
};
const reducerfilesQuery = (state=global.filesQuery, action) => { 
  return state;
};
const rootReducer = combineReducers({ menuList:reducermenuList,filesQuery:reducerfilesQuery });

const store = createStore(rootReducer, preloadedState);
console.log("getState", store.getState());*/

const MAsync = () =>
  import(/* webpackChunkName: "materialize" */ "./src/components/materialize");

const chatAsync = () => import(/* webpackChunkName: "chat" */ "./src/chat");

global.M = undefined;

const getLanguage = () =>
  i18n.language ||
  (typeof window !== "undefined" && window.localStorage.i18nextLng);

var canUseDOM = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

global.isSSR = !canUseDOM;
export const onClientEntry = async () => {
  if (!global.M) {
    const Zep = await MAsync();
    global.M = Zep.default;
  }

  if (/comp|inter|loaded/.test(document.readyState)) {
    Waves.displayEffect();
  } else {
    document.addEventListener(
      "DOMContentLoaded",
      function() {
        Waves.displayEffect();
      },
      false
    );
  }
};

export const replaceHydrateFunction = () => {
  return (element, container, callback) => {
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
      this.setState({ Chat: true });
    }
  }

  render() {
    const Chat = global.Chat;
    console.log("Chatsleep", this.props.location);
    return (
      <>
        <Layout>{this.props.children}</Layout>
        {this.state.Chat && <Chat location={this.props.location} />}
      </>
    );
  }
}

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

export const wrapPageElement = ({ element, props }) => {
  const { lng } = props.pageContext;
  i18n.changeLanguage(lng);
  if (!lng)
    return (
      <>
        <div />
        <App location={props.location}>{element}</App>
      </>
    );

  global.locale[lng].forEach(({ node }) => {
    const { lng, ns, data } = node;
    if (!i18n.hasResourceBundle(lng, ns)) {
      i18n.addResources(lng, ns, JSON.parse(data));
    }
  });
  /*const { slug, slugbase, route, carousel } = props.pageContext;
  const namespace = slugbase === "/" ? "Index" : "Post";
  const ismain = slugbase === "/"; */
  return (
    <>
      <div />
      <App location={props.location} lng={lng}>
        {element}
      </App>
    </>
  );
};
const stateProvider = {
  translate: namespace => i18n.getFixedT(null, [namespace, "common"])
};
export const wrapRootElement = ({ element }) => {
  console.log("stateProvider");
  return (
    <ThemeContext.Provider value={stateProvider}>
      {element}
    </ThemeContext.Provider>
  );
};
