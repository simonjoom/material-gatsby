import React from "react";
import ListSideBar from "./ListSideBar";

//import { SideBarContext } from "../../SideBarContext";

const SideBar = ({ isSideBarOpen,isMobile,Me}) => (
  <>
    {isSideBarOpen && (
      <div
        className="sidechat md-cell md-cell--1 md-cell--1-tablet md-cell--1-phone"
        tabIndex={0}
        role="button"
      >
        <ListSideBar isMobile={isMobile} role={Me.role} />
      </div>
    )}
  </>
);

export default SideBar;
