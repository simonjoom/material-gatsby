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
import NotAuth from "./chatcomponents/error/NotAuth";
import EmailValidated from "./chatcomponents/nav/EmailValidated";
import Header from "./chatcomponents/nav/layout/Header";
import NotFound from "./chatcomponents/error/NotFound";
import SideBar from "./chatcomponents/nav/layout/SideBar";
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

const wsLink = new WebSocketLink({
  uri: "ws://localhost:4000/subscriptions",
  options: {
    reconnect: true,
    connectionParams: () => ({
      authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`
    })
  }
});
const httpLink = new createHttpLink({ uri: "http://localhost:4000" });

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
const Page = props => {
  // const p = props.page ? 1 : 0;

  // style={{ background: `hsl(${p * 75}, 60%, 60%)` }}
  return <div className="page">{props.page}</div>;
};
class ChatLayoutJSX extends Component {
  state = {
    isSideBarOpen: true,
    variant: "permanent",
    isMobile: false
  };
  componentDidMount() {
    console.log("mountLayout");
    console.log("Materialize Ready?", M);
    // this.closeChat = this.closeChat.bind(this);
    var that = this;
    this.manualclose = true;
    var elems = document.querySelectorAll(".collapsible");
    this.instCollaps = M.Collapsible.init(elems, {
      onOpenStart: () => {
        that.clickonCollaps = true;
        that.instanceTap.close();
      },
      onOpenEnd: () => {
        var objDiv = $("#listChats");
        console.log("objDiv", objDiv);
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
    this.instanceTap = M.TapTarget.getInstance(instancestap[0].el);
    M.startTextFields();

    setTimeout(function() {
      // only show the tip after 4sec if the chat Collapsible was never activated on a click
      if (!that.clickonCollaps) {
        that.instanceTap.open();
        setTimeout(function() {
          that.manualclose = false;
          that.instanceTap.close();
        }, 5000);
      }
    }, 4800);
  }
  closeChat = () => {
    this.instCollaps[0].close();
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

  isMobile = () => (window.innerWidth < 600 ? true : false);

  render() {
    // const propstoshare = this.props.children ? this.props.children.props : {};
    const { me: Me, validation } = this.props;
    const authToken = localStorage.getItem(AUTH_TOKEN);

    console.log("renderchat", Me, authToken);
    const size = this.state.isSideBarOpen ? "10" : "12";
    const sizet = this.state.isSideBarOpen ? "7" : "8";
    const sizem = this.state.isSideBarOpen ? "3" : "4";
    return (
      <SideBarContext.Provider
        value={{
          toggleDrawer: this.toggleDrawer,
          state: this.state,
          Me: !Me.loading && !Me.error && Me.me
        }}
      >
        <div className="containerchat">
          <ul className="collapsible popout">
            <li>
              <div className="collapsible-body">
                <Button
                  onClick={() => this.closeChat()}
                  icon="close"
                  style={{ padding: "0 10px" }}
                  className="right btn-large"
                  flat
                  type="material"
                />
                <div className="md-grid">
                  <SideBar />
                  <div
                    className={`md-cell md-cell--${size} md-cell--${sizet}-tablet md-cell--${sizem}-phone`}
                  >
                    {Me.loading && <Loading />}
                    {Me.error && <NotAuth />}

                    <Location>
                      {({ location }) => <Header location={location} />}
                    </Location>
                    {!Me.loading &&
                      !Me.error &&
                      validation && (
                        <EmailValidated emailvalidated={Me.me.emailvalidated} />
                      )}

                    <FadeTransitionRouter>
                      <Page path="/z/users" page={<UsersPage />} />
                      <Page path="/z/user/create" page={<UserPageCreate />} />
                      <Page
                        path="/z/user/:id"
                        page={<UserPage path="/z/user/:id" />}
                      />
                      <Page path="/z/chats" page={<ChatsPage />} />
                      <Page path="/z/login" page={<Login />} />
                      <Page path="/z/signup" page={<Signup />} />
                      <Page
                        path="/z/forgetPassword"
                        page={<ForgetPassword />}
                      />
                      <Page path="/z/resetPassword" page={<ResetPassword />} />
                      <Page
                        path="/z/updatePassword"
                        page={<UpdatePassword />}
                      />
                      <Page path="/z/validateEmail" page={<ValidateEmail />} />
                      <Page
                        path="/"
                        default
                        page={
                          !authToken ? (
                            <Login path="/" />
                          ) : (
                            <ChatsPage path="/" />
                          )
                        }
                      />
                    </FadeTransitionRouter>
                  </div>
                </div>
              </div>

              <div className="collapsible-header waves-effect waves-light btn">
                <Logo id="chat" width={40} height={40} />
                <p style={{ marginLeft: 20 }}>Need Help?</p>
                <Badge newIcon>4</Badge>
              </div>
            </li>
          </ul>
          <div className="tap-target bgprimary" data-target="chat">
            <div className="tap-target-content white">
              <h5 className="h2 nolineheight">Hello </h5>
              <h6 className="h3 nolineheight">
                Chat with your ski instructors :)
              </h6>
            </div>
          </div>
        </div>
      </SideBarContext.Provider>
    );
  }
}

const FadeTransitionRouter = ({ children }) => {
  // const childrenpass = React.cloneElement(children, propstoshare);
  console.log("startFadeTransitionRouter");
  return (
    <Location>
      {({ location }) => (
        <TransitionGroup className="transition-group">
          <CSSTransition key={location.key} classNames="fade" timeout={400}>
            <Router location={location} className="router">
              {children}
            </Router>
          </CSSTransition>
        </TransitionGroup>
      )}
    </Location>
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
