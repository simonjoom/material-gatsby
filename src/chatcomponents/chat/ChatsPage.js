import React, { Component } from "react";
import ChatsPageList from "./ChatsPageList";
import CreateChat from "./CreateChat";
import NotAuth from "../error/NotAuth";
import { AUTH_TOKEN } from "../../constants/constants";

class ChatsPage extends Component {
  state = {
    orderBy: "createdAt_ASC",
    openChat: true
  };
  /* componentWillReceiveProps(props) {
    console.log("props" ,props)
    this.setState({ openChat: props.openChat });
  }*/
  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN);
    console.log("ChatsPage");
    if (!authToken) {
      return <NotAuth />;
    }
    return (
      <div className="itc-messenger-body">
        <div className="itc-cvs-body">
          <div className="itc-cvs-body-parts">
            <div className="itc-cvs-parts-wrapper">
              <div
                className="itc-cvs-parts md-grid"
                style={{ margin: 0, padding: 0, marginTop: 5 }}
              >
                <ChatsPageList orderBy={this.state.orderBy} />
              </div>
            </div>
          </div>
        </div>
        <CreateChat />
      </div>
    );
  }
}

export default ChatsPage;
