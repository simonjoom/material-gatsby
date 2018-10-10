import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import { Router } from "@reach/router";
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

class ChatLayoutJSX extends Component {
  state = {
    isSideBarOpen: true,
    variant: "permanent",
    isMobile: false
  };
  componentDidMount() {
    console.log("mountLayout");
    console.log("Materialize Ready?", global.M);

    M.startTextFields();
    var elems = document.querySelectorAll(".collapsible");
    this.instances = global.M.Collapsible.init(elems, {});
  }

  componentWillUnmount() {
    console.log("unmountLayout");
    if (this.instance) {
      this.instance.destroy();
    }
  }

  /*
toggleDrawer = isSideBarOpen => () => {
  if (!isSideBarOpen && !this.isMobile()) {
    return;
  }
  this.setState({
    isSideBarOpen: isSideBarOpen
  });
};*/
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
    const child = this.props.children;
    const Page = props => {
      return (
        <div
          className="page"
          default={!!props.default}
          path={props.path}
          style={{ background: `hsl(${props.page * 75}, 60%, 60%)` }}
        >
          {child}
        </div>
      );
    };
    // const propstoshare = this.props.children ? this.props.children.props : {};
    const { me: Me, validation } = this.props;

    return (
      <SideBarContext.Provider
        value={{
          state: this.state,
          Me: !Me.loading && !Me.error && Me.me
        }}
      >
        <div className="containerchat">
          {" "}
          <ul className="collapsible popout">
            <li>
              <div className="collapsible-body">
                <div className="md-grid">
                  <SideBar />

                  <div className="md-cell md-cell--10">
                    {Me.loading && <Loading />}
                    {Me.error && <NotAuth />}
                    <Header location={this.props.location} />
                    {!Me.loading &&
                      !Me.error &&
                      validation && (
                        <EmailValidated emailvalidated={Me.me.emailvalidated} />
                      )}

                    <FadeTransitionRouter location={this.props.location}>
                      <Page path="/car/create" />
                      <Page path="/car/:id" />
                      <Page path="/cars" />
                      <Page path="/z/drafts" />
                      <Page path="/z/users" />
                      <Page path="/z/user/create" />
                      <Page path="/z/user/:id" />
                      <Page path="/z/create" />
                      <Page path="/z/post/:id" />
                      <Page path="/z/login" />
                      <Page path="/z/signup" />
                      <Page path="/z/forgetPassword" />
                      <Page path="/z/resetPassword" />
                      <Page path="/z/updatePassword" />
                      <Page path="/z/validateEmail" />
                      <Page path="/" default />
                    </FadeTransitionRouter>
                  </div>
                </div>
              </div>
              <div className="collapsible-header">
                <i className="material-icons">whatshot</i>
                OPENCHAT
              </div>
            </li>
          </ul>
        </div>
      </SideBarContext.Provider>
    );
  }
}

const FadeTransitionRouter = ({ location, children }) => {
  // const childrenpass = React.cloneElement(children, propstoshare);
  return (
    <TransitionGroup className="transition-group">
      <CSSTransition
        key={location.key}
        classNames="fade"
        timeout={{ enter: 500, exit: 300 }}
      >
        <Router location={location}>{children}</Router>
      </CSSTransition>
    </TransitionGroup>
  );
};

ChatLayoutJSX.defaultProps = {
  validation: false
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

const Chat = ({ location }) => {
  const authToken = localStorage.getItem(AUTH_TOKEN);
  const Comp =
    location.pathname == "/z/user/create"
      ? UserPageCreate
      : location.pathname == "/z/users"
        ? UsersPage
        : location.pathname.indexOf("/user/") == !-1 //:id
          ? UserPage
          : /* : location.pathname == "/z/car/create"
            ? CreateCar
            : location.pathname == "/z/cars"
              ? CarsPage
              : location.pathname.indexOf("/car/") == !-1 //:id
                ? DetailCar
                : location.pathname == "/z/create"
                  ? CreatePage
                  : location.pathname == "/z/drafts"
                    ? DraftsPage
                      : location.pathname == "/z/posts"
                        ? FeedPage
                        : location.pathname.indexOf("/post/") == !-1 //:id
                          ? DetailPage*/
            location.pathname == "/z/forgetPassword"
            ? ForgetPassword
            : location.pathname == "/z/resetPassword"
              ? ResetPassword
              : location.pathname == "/z/updatePassword"
                ? UpdatePassword
                : location.pathname == "/z/validateEmail"
                  ? ValidateEmail
                  : location.pathname == "/z/signup"
                    ? Signup
                    : location.pathname == "/z/login"
                      ? Login
                      : !authToken
                        ? Login
                        : ChatsPage;
  return (
    <ApolloProvider client={client}>
      <ChatLayout location={location}>
        <Comp />
      </ChatLayout>
    </ApolloProvider>
  );
};
export default Chat;
