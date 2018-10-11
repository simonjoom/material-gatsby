import React, { Component } from "react";
import ListSideBar from "./ListSideBar";
import { SideBarContext } from "../../SideBarContext";

class SideBar extends Component {
  render() {
    return ( 
          <div className="md-cell md-cell--2"> 
              <div tabIndex={0} role="button">
                <ListSideBar
                />
              </div> 
          </div> 
    );
  }
}

export default SideBar;

/*
            variant={context.state.variant}
            open={context.state.isSideBarOpen}*/
