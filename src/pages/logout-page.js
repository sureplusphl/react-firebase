import React, { useContext } from "react";
import { withRouter } from "react-router-dom";
import { message } from "antd";
import { AuthContext } from "../shared/contexts/auth.context";

const LogoutPage = ({ history }) => {
  const { auth } = useContext(AuthContext);
  auth
    .signOut()
    .then(function () {
      history.push("/login");
    })
    .catch(function (error) {
      message.error(error);
    });
  return "Logging out";
};

export default withRouter(LogoutPage);
