import React, { Component } from "react";
import ChatsPageList from "./ChatsPageList";
import CreateChat from "./CreateChat";
import NotAuth from "../error/NotAuth";
import { AUTH_TOKEN } from "../../constants/constants";

class ChatsPage extends Component {
  state = {
    orderBy: "createdAt_ASC",
    addcss: ""
  };
  componentDidMount(props) {
    this.setState({ addcss: " itc-cvs itc-messenger-body-view-enter-done" });
  }

  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN);
    console.log("ChatsPage");
    if (!authToken) {
      return <NotAuth />;
    }
    return (
      <div className={`itc-messenger-body${this.state.addcss}`}>
        <div className="itc-cvs-body">
          <div className="itc-cvs-body-parts" id="listChats">
            <div className="itc-cvs-parts-wrapper">
              <div
                className="itc-cvs-parts md-grid"
                style={{ margin: 0, padding: 0, marginTop: 5 }}
              >
                {this.state.addcss !== "" && (
                  <ChatsPageList orderBy={this.state.orderBy} />
                )}
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
