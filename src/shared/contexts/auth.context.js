import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { message } from "antd";
import { withRouter } from "react-router-dom";
import { FirebaseContext } from "./firebase.context";

export const AuthContext = createContext();

const AuthProvider = ({ children, history }) => {
  const { auth, firebase, authUI, database } = useContext(FirebaseContext);
  const [loggedUser, setLoggedUser] = useState();

  const initAuth = () => {
    auth.onAuthStateChanged((user) => {
      setLoggedUser(user);
    });
  };

  useEffect(() => {
    initAuth();
  }, []);

  const postLogin = ({ email, password }) => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        history.push("/");
      })
      .catch(function (error) {
        const errorMessage = error.message;
        message.error(errorMessage);
      });
  };

  const payload = {
    auth,
    authUI,
    database,
    firebase,
    postLogin,
    loggedUser,
    setLoggedUser,
  };

  return (
    <AuthContext.Provider value={payload}>{children}</AuthContext.Provider>
  );
};

AuthProvider.defaultProps = {};

AuthProvider.propTypes = {
  children: PropTypes.object.isRequired,
};

export default withRouter(AuthProvider);
