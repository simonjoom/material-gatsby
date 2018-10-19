import React from "react";
import TopHello from "./TopHello";
import { navigate } from "gatsby";
import Button from "../../../reactLIB/Button";
import BackButton from "./BackButton";

const Header = ({ location, me, onClose, isSideBarOpen, isMobile }) => {
  return (
    <header className="sidechath headerchat md-grid md-grid--no-spacing">
      <div className="md-cell md-cell--1-phone md-cell--3-tablet md-cell--4">
        <BackButton location={location} isSideBarOpen={isSideBarOpen} isMobile={isMobile} />
      </div>
      <div className="md-cell md-cell--1-phone md-cell--3-tablet md-cell--4">
        <Button
          onClick={() => {
            console.log("flexGrowclick");
            navigate("/");
          }}
          type="material"
          flat
          icon="home"
        />
      </div>
      <TopHello
        me={me}
        className="md-cell md-cell--1-phone md-cell--1-tablet md-cell--3"
      />
      <Button
        onClick={() => onClose()}
        icon="close"
        style={{ position: "absolute", right: 0, width: "20px" }}
        flat
        type="mat"
      />
    </header>
  );
};

export default Header;
