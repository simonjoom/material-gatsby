import React from "react";
import ListSideBar from "./ListSideBar";
import { SideBarContext } from "../../SideBarContext";

const SideBar = () => (
  <SideBarContext.Consumer>
    {context =>
      context.state.isSideBarOpen && (
        <div className="md-cell md-cell--2" tabIndex={0} role="button">
          <ListSideBar
            isMobile={context.state.isMobile}
            role={context.Me.role}
          />
        </div>
      )
    }
  </SideBarContext.Consumer>
);

export default SideBar;
