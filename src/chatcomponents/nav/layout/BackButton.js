import React, { Component } from "react";
import Button from "../../../reactLIB/Button";
import { SideBarContext } from "../../SideBarContext";

class BackButton extends Component {
  render() { 
    return (
      <div>
        {this.props.location.action === "PUSH" ? (
          <Button
            onClick={() => window.history.back()}
            icon="arrow_back"
            flat
            type="material"
          />
        ) : (
          <SideBarContext.Consumer>
            {context => (
              <Button
                onClick={() => context.toggleDrawer()}
                icon="menu"
                flat
                type="material"
              />
            )}
          </SideBarContext.Consumer>
        )}
      </div>
    );
  }
}

export default BackButton;
