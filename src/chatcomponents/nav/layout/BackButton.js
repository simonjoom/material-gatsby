import React, { Component } from "react";
import Button from "../../../reactLIB/Button";
import { SideBarContext } from "../../SideBarContext";
import Dropdown from "../../../reactLIB/Dropdown";
import ListSideBar from "./ListSideBar"


class BackButton extends Component {
  render() {
    const { location } = this.props;
    return (
      <div>
        {location.action === "PUSH" ? (
          <Button
            onClick={() => window.history.back()}
            icon="arrow_back"
            flat
            type="material"
          />
        ) : (
          <SideBarContext.Consumer>
            {context => (
              <Dropdown trigger={<Button icon="menu" flat type="material" />}>
                <ListSideBar isMobile={context.state.isMobile} role={context.Me.role} />
              </Dropdown>
            )}
          </SideBarContext.Consumer>
        )}
      </div>
    );
  }
}

export default BackButton;
