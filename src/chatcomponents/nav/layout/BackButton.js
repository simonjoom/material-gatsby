import React, { Component } from "react";
import { Location } from "@reach/router";
import Button from "../../../reactLIB/Button";
import { SideBarContext } from "../../SideBarContext";

class BackButton extends Component {
  render() {
    return (
      <Location>
        {({ location }) => (
          <div>
            {location.pathname !== "/" ? (
              <Button
                onClick={() => window.history.back()}
                icon="arrow_back"
                flat
                type="material"
              />
            ) : (
              <Button
                onClick={() => context.toggleDrawer(true)}
                icon="menu"
                flat
                type="material"
              />
            )}
          </div>
        )}
      </Location>
    );
  }
}

export default BackButton;
