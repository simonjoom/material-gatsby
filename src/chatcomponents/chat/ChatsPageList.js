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

  componentDidMount() {
    var that = this;
    this.props.chatsQueryConnection.subscribeToMore({
      document: CHAT_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }
        const edge = subscriptionData.data.chat;
        console.log("edge", edge);
        that.arrSSR.push(<Chat key={edge.node.id} chat={edge.node} />);
        setTimeout(() => {
          that.setState({ arr: [...this.state.arr, this.arrSSR.shift()] });
        }, 1000);

        if (
          !prev.chatsConnection.edges.find(ed => ed.node.id === edge.node.id)
        ) {
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

  componentWillReceiveProps = nextprops => {
    if (nextprops.chatsQueryConnection.chatsConnection && !this.running) {
      const { edges } = nextprops.chatsQueryConnection.chatsConnection;
      console.log("this.arrSSR", this.arrSSR);
      edges.forEach((chat, index) => {
        this.arrSSR.push(<Chat key={chat.node.id} chat={chat.node} />);
      });
      !(process.env.GATSBY_BUILD_STAGE == "build-html") && this.runAnim();
    }
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
      }, 500);
      this.running = false;
    }
    var objDiv = $("#listChats");
    if (objDiv[0]) {
      var t = objDiv[0].scrollHeight;
      objDiv[0].scrollTop = t;
    }
  }

  runAnim = () => {
    this.running = true;
    setTimeout(() => {
      this.setState({ arr: [...this.state.arr, this.arrSSR.shift()] });
    }, 1000);
  };

  render() {
    console.log("ChatsPageList", this.props.chatsQueryConnection);
    if (this.props.chatsQueryConnection.error) {
      return <NotAuth />;
    }

    if (this.props.chatsQueryConnection.loading) {
      return <Loading />;
    }

    // const { edges } = this.props.chatsQueryConnection.chatsConnection;

    return (
      <div>
        {!(process.env.GATSBY_BUILD_STAGE == "build-html")
          ? this.state.arr
          : this.arrSSR}
      </div>
    );
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
