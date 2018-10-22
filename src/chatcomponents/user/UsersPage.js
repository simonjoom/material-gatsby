import React from "react";
import { navigate } from "gatsby";
import Card from "../../reactLIB/Card";
import Input from "../../reactLIB/Input";
import UsersPageList from "./UsersPageList";

class UsersPage extends React.Component {
  state = {
    query: "",
    orderBy: "name_ASC"
  };

  elemClicked(elem) {
    navigate("/z/user/" + elem.id);
  }

  render() {
    return (
      <div className="userspage">
        <div className="">
          <h1 className="userspage__header">Users</h1>
        </div>
        <Input
          onChange={e => this.setState({ query: e.target.value })}
          value={this.state.query}
          type="text"
          placeholder="Search"
        />
        <hr/>
        <UsersPageList
          showWhenQueryEmpty={true}
          query={this.state.query}
          showTitle={true}
          showMore={true}
          elemClicked={this.elemClicked.bind(this)}
          orderBy={this.state.orderBy}
        />
      </div>
    );
  }
}

export default UsersPage;
