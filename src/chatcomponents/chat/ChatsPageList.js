import React from "react";
import Chat from "./Chat";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import NotAuth from "../error/NotAuth";
import Loading from "../error/Loading";

class ChatsPageList extends React.Component {
  state = {
    arr: []
  };
  constructor(props) {
    super(props);
    this.arrSSR = [];
  }
  componentWillMount() {
    var that = this;
    this.props.chatsQueryConnection.subscribeToMore({
      document: CHAT_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }
        const edge = subscriptionData.data.chat;
        if (
          !prev.chatsConnection.edges.find(ed => ed.node.id === edge.node.id)
        ) {
          that.arrSSR.push(<Chat key={edge.node.id} chat={edge.node} />);
          if (edge.node.author.id !== that.props.Me.id) {
            setTimeout(() => {
              that.props.addnewmessage();
            }, 500);
          } else {
            setTimeout(() => {
              that.running = true;
              that.setState({ arr: [...that.state.arr, that.arrSSR.shift()] });
            }, 1000);
          }
          return Object.assign({}, prev, {
            chatsConnection: {
              __typename: "ChatConnection",
              edges: [...prev.chatsConnection.edges, edge]
            }
          });
        } else {
          return prev;
        }
      }
    });
  }
  runAnim = chatsConnection => {
    if (!this.running && chatsConnection) {
      const { edges } = chatsConnection;
      edges.forEach((chat, index) => {
        this.arrSSR.push(<Chat key={chat.node.id} chat={chat.node} />);
      });

      this.running = true;
      setTimeout(() => {
        this.setState({ arr: [...this.state.arr, this.arrSSR.shift()] });
      }, 600);
    }
  };

  componentDidMount() {
    //  console.log("ChatsPageListmount")
    this.runAnim(this.props.chatsQueryConnection.chatsConnection);
  }

  componentWillReceiveProps = nextprops => {
    this.runAnim(nextprops.chatsQueryConnection.chatsConnection);
  };

  componentWillUnmount() {
    this.running = false;
  }

  componentDidUpdate() {
    if (this.running && this.arrSSR.length > 0) {
      setTimeout(() => {
        this.setState(() => {
          this.running = true;
          return { arr: [...this.state.arr, this.arrSSR.shift()] };
        });
      }, 100);
      this.running = false;
    }
    var objDiv = $("#listChats");
    if (objDiv[0]) {
      var t = objDiv[0].scrollHeight;
      objDiv[0].scrollTop = t;
    }
  }

  render() {
    //   console.log("ChatsPageList", this.props.chatsQueryConnection);
    if (this.props.chatsQueryConnection.error) {
      return <NotAuth />;
    }

    if (this.props.chatsQueryConnection.loading) {
      return <Loading />;
    }

    // const { edges } = this.props.chatsQueryConnection.chatsConnection;

    return <div>{this.state.arr}</div>;
  }
}

const CHATS_QUERY = gql`
  query ChatsQueryConnection(
    $after: String
    $orderBy: ChatOrderByInput
    $where: ChatWhereInput
    $skip: Int
  ) {
    chatsConnection(
      after: $after
      orderBy: $orderBy
      where: $where
      last: 10
      skip: $skip
    ) {
      edges {
        node {
          id
          message
          createdAt
          author {
            id
            name
            nameFile
            role
          }
        }
      }
    }
  }
`;

const CHAT_SUBSCRIPTION = gql`
  subscription {
    chat(where: { mutation_in: [CREATED] }) {
      node {
        id
        message
        createdAt
        author {
          id
          name
          nameFile
          role
        }
      }
    }
  }
`;

export default compose(
  graphql(CHATS_QUERY, {
    name: "chatsQueryConnection",
    fetchPolicy: "network-only",
    options: props => ({
      variables: {
        orderBy: props.orderBy
      }
    })
  })
)(ChatsPageList);

/*
      <div
        style={{ height: "350px", overflow: "scroll" }}
        className="md-cell md-cell--12 listChats"
        id="listChats"
      >*/
