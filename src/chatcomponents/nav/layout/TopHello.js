import React from "react";
import { AUTH_TOKEN } from "../../../constants/constants";
import { Link } from "gatsby";
import MenuAvatar from "./MenuAvatar";
import { SideBarContext } from "../../SideBarContext";

const TopHello = ({ className }) => {
  return (
    <SideBarContext.Consumer>
      {context => {
        const authToken = localStorage.getItem(AUTH_TOKEN);
        const connected = authToken && context.Me;
        return (
          <div className={className}>
            {connected && (
              <MenuAvatar user={context.Me} nameFile={context.Me.nameFile} />
            )}
            {!connected && (
              <Link to="login" className="ml1 no-underline black">
                login
              </Link>
            )}
          </div>
        );
      }}
    </SideBarContext.Consumer>
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
