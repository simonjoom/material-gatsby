import React, { Component } from "react";
import ChatsPageList from "./ChatsPageList";
import CreateChat from "./CreateChat";
import NotAuth from "../error/NotAuth";
import Card from "../../reactLIB/Card";
import { AUTH_TOKEN } from "../../constants/constants";

class ChatsPage extends Component {
  state = {
    orderBy: "createdAt_ASC",
    addcss: ""
  };
  componentDidMount() {
    if (this.props.chatisrunnable) {
      setTimeout(() => {
        this.setState({
          addcss: " itc-cvs itc-messenger-body-view-enter-done"
        });
      }, 50);
    }
  }
  componentWillReceiveProps = nextprops => {
    if (nextprops.chatisrunnable) {
      setTimeout(() => {
        this.setState({
          addcss: " itc-cvs itc-messenger-body-view-enter-done"
        });
      }, 250);
    }
  };

  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN);
    const { addnewmessage } = this.props;
    if (!authToken) {
      return <NotAuth />;
    }
    return (
      <div className={`itc-messenger-body${this.state.addcss}`}>
        <Card className="itc-cvs-body-parts" id="listChats">
          <div className="itc-cvs-parts-wrapper">
            <div
              className="itc-cvs-parts md-grid"
              style={{ margin: 0, padding: 0, marginTop: 5 }}
            >
              {this.state.addcss !== "" && (
                <ChatsPageList
                  orderBy={this.state.orderBy}
                  addnewmessage={addnewmessage}
                  Me={this.props.Me}
                />
              )}
            </div>
          </div>
        </Card>
        <CreateChat />
      </div>
    );
  }
}

export default ChatsPage;
