import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import { Router, Location, globalHistory } from "@reach/router";
import gql from "graphql-tag";
import { AUTH_TOKEN } from "./constants/constants";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";
import { split } from "apollo-link";
//import { onError } from "apollo-link-error";
//import { ApolloClient, InMemoryCache, HttpLink, split } from 'apollo-client-preset';
import { WebSocketLink } from "apollo-link-ws";
//import { createUploadLink } from "apollo-upload-client";
import { getMainDefinition } from "apollo-utilities";
//import CSSTransition from "react-transition-group/CSSTransition";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Loading from "./chatcomponents/error/Loading";
import EmailValidated from "./chatcomponents/nav/EmailValidated";
import Header from "./chatcomponents/nav/layout/Header";
import NotFound from "./chatcomponents/error/NotFound";
import { SideBarContext } from "./chatcomponents/SideBarContext";

import UsersPage from "./chatcomponents/user/UsersPage";
import UserPageCreate from "./chatcomponents/user/UserPageCreate";
import UserPage from "./chatcomponents/user/UserPage";
import Logo from "./components/logo";
/*
import CreateCar from "./chatcomponents/car/CreateCar";
import DetailCar from "./chatcomponents/car/DetailCar";
import CarsPage from "./chatcomponents/car/CarsPage";*/
//import Api from "./chatcomponents/api/Api";
import ForgetPassword from "./chatcomponents/user/auth/ForgetPassword";
import Login from "./chatcomponents/user/auth/Login";
import Signup from "./chatcomponents/user/auth/Signup";
import ResetPassword from "./chatcomponents/user/auth/ResetPassword";
import UpdatePassword from "./chatcomponents/user/auth/UpdatePassword";
import ValidateEmail from "./chatcomponents/user/auth/ValidateEmail";
/*import DraftsPage from "./chatcomponents/post/DraftsPage";
import CreatePage from "./chatcomponents/post/CreatePage";
import DetailPage from "./chatcomponents/post/DetailPage";
import FeedPage from "./chatcomponents/post/FeedPage";*/
import ChatsPage from "./chatcomponents/chat/ChatsPage";
import Badge from "./reactLIB/Badge";
import Button from "./reactLIB/Button";

let pathbackend = "https://ns327841.ip-37-187-112.eu/graphql";
let uriwebsocket = "wss://ns327841.ip-37-187-112.eu/subscriptions";
//+process.env.REACT_APP_ENDPOINT;
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  // dev code
  pathbackend = "http://localhost:4000/graphql";
  uriwebsocket = "ws://localhost:4000/subscriptions";
}

const wsLink = new WebSocketLink({
  uri: uriwebsocket,
  options: {
    reconnect: true,
    connectionParams: () => ({
      authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`
    })
  }
});
const httpLink = new createHttpLink({ uri: pathbackend });

const middlewareAuthLink = setContext((_, { headers }) => {
  console.log("middlewareAuthLink", localStorage.getItem(AUTH_TOKEN));
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem(AUTH_TOKEN);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : ``
    }
  };
});

const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink);

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLinkWithAuthToken
);

const client = new ApolloClient({
  link,
  ssrMode: false,
  cache: new InMemoryCache()
});

const USER_QUERY = gql`
  query Me {
    me {
      id
      role
      emailvalidated
    }
  }
`;

const isMobile = () => window && (window.innerWidth < 600 ? true : false);
const Page = ({ page, Teader, startChat }) => {
  // const p = props.page ? 1 : 0;
  // style={{ background: `hsl(${p * 75}, 60%, 60%)` }}
  return (
    <div className="page" id="itc-ctr">
      <div className="itc-messenger itc-messenger-cvs itc-messenger-from-home-screen">
        <div className="itc-messenger-header">
          <div
            aria-label="Expand cvs"
            role="button"
            tabIndex="0"
            className="md-grid md-grid--stacked"
          >
            {Teader()}
            <div
              className="md-cell md-cell--6 md-cell--center md-cell--middle"
              aria-hidden="false"
              style={{ opacity: 1 }}
            >
              <div className="itc-admin-profile-compact-contents">
                <div className="itc-admin-profile-compact-avatar-ctr">
                  <div className="itc-admin-profile-compact-avatar">
                    <div className="itc-avatar">
                      <img
                        src="https://static.intercomassets.com/avatars/1422586/square_128/myAvatar-2-270x250-1509093775.png?1509093775"
                        alt="E-Residency profile"
                      />
                    </div>
                    <div className="itc-active-state" />
                  </div>
                </div>
                <div className="itc-admin-profile-compact-body md-grid md-grid--stacked">
                  <div className="md-cell md-cell--12">Valentina</div>
                  <div className="md-cell md-cell--12">Active</div>
                  <h4 className="md-cell md-cell--12">{startChat}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {page}
      </div>
    </div>
  );
};
class ChatLayoutJSX extends Component {
  state = {
    isSideBarOpen: !isMobile(),
    variant: "permanent",
    isMobile: false
  };
  componentDidMount() {
    console.log("mountLayout");
    console.log("Materialize Ready?", M);
    // this.closeChat = this.closeChat.bind(this);
    var that = this;
    this.manualclose = true;
    var elems = document.querySelectorAll("#myChat .collapsible");
    this.instCollaps = M.Collapsible.init(elems, {
      onOpenStart: () => {
        that.clickonCollaps = true;
        $("body").addClass("stop-scroll");
        that.instanceTap && that.instanceTap.close();
        $("body").addClass("stop-scroll")
      },
      onOpenEnd: () => {
        var objDiv = $("#listChats");
        if (objDiv[0]) {
          var t = objDiv[0].scrollHeight;
          objDiv[0].scrollTop = t;
        }
      }
    });

    var el = document.querySelectorAll(".tap-target");
    var instancestap = M.TapTarget.init(el, {
      onClose: () => {
        if (that.manualclose) {
          var instance = that.instCollaps[0];
          setTimeout(function() {
            instance.open();
          }, 400);
        }
        // console.log("opentrae",instance);
      }
    });
    M.startTextFields();
    const run = localStorage.getItem("Tapinstance");
    if (run !== "run")
      setTimeout(function() {
        // only show the tip after 4sec if the chat Collapsible was never activated on a click
        if (!that.clickonCollaps) {
          that.instanceTap = M.TapTarget.getInstance(instancestap[0].el);
          that.instanceTap.open();
          localStorage.setItem("Tapinstance", "run");
          setTimeout(function() {
            that.manualclose = false;
            that.instanceTap.close();
          }, 5000);
        }
      }, 4800);
  }
  closeChat = () => {
    $("body").removeClass("stop-scroll");
    this.instCollaps[0].close();
    $("body").removeClass("stop-scroll")
  };
  componentWillUnmount() {
    if (this.instCollaps) {
      this.instCollaps.destroy();
    }
    if (this.instance) {
      this.instance.destroy();
    }
  }
  toggleDrawer = () => {
    this.setState({
      isSideBarOpen: !this.state.isSideBarOpen
    });
  };
  /*
*/
  /*
componentDidMount() {
  window.addEventListener("resize", this.resize);
  this.setState({
    isMobile: this.isMobile(),
    variant: this.isMobile() ? "persistent" : "permanent"
    //   isSideBarOpen: this.isMobile() ? false : true
  });
}

resize = () => {
  this.setState({
    isMobile: this.isMobile(),
    variant: this.isMobile() ? "persistent" : "permanent"
    //    isSideBarOpen: this.isMobile() ? false : true
  });
};*/

  render() {
    // const propstoshare = this.props.children ? this.props.children.props : {};
    const { me: Mep, validation } = this.props;
    const authToken = localStorage.getItem(AUTH_TOKEN);
    const startChat = global.tr("Index")("startChat");
    const size = this.state.isSideBarOpen ? "11" : "12";
    const sizet = this.state.isSideBarOpen ? "7" : "8";
    const sizem = this.state.isSideBarOpen ? "3" : "4";
    console.log("Mep",Mep.me)
    let Me = Mep.me;
    return (
      <ul className="collapsible popout">
        <li>
          <Location>
            {({ location }) => {
              const other = {
                startChat,
                Teader: () => (
                  <SideBarContext.Provider
                    value={{
                      toggleDrawer: this.toggleDrawer,
                      state: this.state,
                      Me: !Mep.loading && !Mep.error && Me
                    }}
                  >
                    <Header
                      location={location}
                      onClose={() => this.closeChat()}
                      isSideBarOpen={this.state.isSideBarOpen}
                      isMobile={this.state.isMobile}
                    />
                  </SideBarContext.Provider>
                )
              };
              return (
                <>
                  <div className="collapsible-body itc-messenger-frame itc-messenger-frame-enter-done">
                    <div
                      className="md-grid md-grid--no-spacing"
                      style={{ height: "100%" }}
                    >
                      {/* {!Mep.loading &&
                        !Mep.error &&
                        Me && (
                          <SideBar
                            Me={Me}
                            isSideBarOpen={this.state.isSideBarOpen}
                            isMobile={this.state.isMobile}
                          />
                        )} */}
                      <div
                        className={`md-grid md-grid--no-spacing md-grid--stacked md-cell md-cell--${size} md-cell--${sizet}-tablet md-cell--${sizem}-phone`}
                      >
                        {Mep.loading && <Loading />}

                        <FadeTransitionRouter location={location}>
                          <Page path="/users" page={<UsersPage />} {...other} />
                          <Page
                            path="/user/create"
                            page={<UserPageCreate />}
                            {...other}
                          />
                          <Page
                            path="/user/:id"
                            page={<UserPage path="/user/:id" />}
                            {...other}
                          />
                          <Page path="/chats" page={<ChatsPage />} {...other} />
                          <Page path="/login" page={<Login />} {...other} />
                          <Page path="/signup" page={<Signup />} {...other} />
                          <Page
                            path="/forgetPassword"
                            page={<ForgetPassword />}
                            {...other}
                          />
                          <Page
                            path="/resetPassword"
                            page={<ResetPassword />}
                            {...other}
                          />
                          <Page
                            path="/updatePassword"
                            page={<UpdatePassword />}
                            {...other}
                          />
                          <Page
                            path="/validateEmail"
                            page={<ValidateEmail />}
                            {...other}
                          />
                          <Page
                            path="/"
                            default
                            {...other}
                            page={
                              !authToken ? (
                                <Login path="/" />
                              ) : (
                                <ChatsPage path="/" />
                              )
                            }
                          />
                        </FadeTransitionRouter>
                        {!Mep.loading &&
                          !Mep.error &&
                          validation && (
                            <EmailValidated
                              emailvalidated={Me.emailvalidated}
                            />
                          )}
                      </div>
                    </div>
                  </div>

                  <div
                    className="collapsible-header waves-effect waves-light btn"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Logo id="chat" width={40} height={40} />
                    <p style={{ marginLeft: 20 }}>
                      {global.tr("Index")("Chathello")}?
                    </p>
                    <Badge newIcon>4</Badge>
                  </div>
                  <div className="tap-target bgprimary" data-target="chat">
                    <div className="tap-target-content white">
                      <h5 className="h2 nolineheight">
                        {global.tr("Index")("hello")}
                      </h5>
                      <h6 className="h3 nolineheight">
                        {global.tr("Index")("chatwith")}
                      </h6>
                    </div>
                  </div> 
                </>
              );
            }}
          </Location>
        </li>
      </ul>
    );
  }
}

const FadeTransitionRouter = ({ children, location }) => {
  // const childrenpass = React.cloneElement(children, propstoshare);
  console.log("startFadeTransitionRouter", location);
  return (
    <TransitionGroup className="transition-group">
      <CSSTransition key={location.key} classNames="fade" timeout={400}>
        <Router location={location} className="router">
          {children}
        </Router>
      </CSSTransition>
    </TransitionGroup>
  );
};

ChatLayoutJSX.defaultProps = {
  validation: false,
  me: {}
};

const ChatLayout = compose(
  graphql(USER_QUERY, {
    name: "me",
    options: props => {
      return {
        fetchPolicy: "cache-and-network",
        ssr: false
      };
    }
  })
)(ChatLayoutJSX);

const Chat = () => {
  return (
    <ApolloProvider client={client}>
      <ChatLayout />
    </ApolloProvider>
  );
};
export default Chat;
