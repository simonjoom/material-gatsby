import React, { Component } from "react";
import { AUTH_TOKEN } from "../../../constants/constants";
import { Link } from "@reach/router";
import MenuAvatar from "./MenuAvatar";

const TopHello = ({ me }) => {
  const authToken = localStorage.getItem(AUTH_TOKEN); 
  const connected = authToken && me.me;
  return (
    <>
      {connected && <MenuAvatar user={me.me} nameFile={me.me.nameFile} />}
      {!connected && (
        <Link to="login" className="ml1 no-underline black">
          login
        </Link>
      )}
    </>
  );
};
export default TopHello;
/*
const USER_QUERY = gql`
  query Me {
    me {
      id
      email
      role
      name
      nameFile
    }
  }
`;

export default compose(
  graphql(USER_QUERY, { name: "me" }),
  withApollo
)(TopHello);*/
