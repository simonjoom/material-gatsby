import React, { Component } from "react";
import Card from "../../reactLIB/Card";
import { Link } from "@reach/router";

class NotAuth extends Component {
  render() {
    return (
      <div className="paperOut">
        <Card className="paperIn">
          Not authentificated!
          <br />
          <br />
          <Link to="z/login">Login</Link>
        </Card>
      </div>
    );
  }
}

export default NotAuth;
