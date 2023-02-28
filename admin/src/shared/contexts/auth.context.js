import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FirebaseContext } from "./firebase.context";
import { message } from "antd";
import { withRouter } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children, history }) => {
  const { auth, firebase, authUI, database } = useContext(FirebaseContext);
  const [loggedUser, setLoggedUser] = useState();
  const [userInfoRole, setUserInfoRole] = useState();
  const [userInfoStore, setUserInfoStore] = useState();
  const [userInfoCate, setUserInfoCate] = useState();
  
  const initAuth = () => {
    auth.onAuthStateChanged((user) => {
      setLoggedUser(user);

      const userRef = database.ref('user');
      userRef.orderByChild("email").equalTo(user.email).on("value", (snapshot) => {
        const userObject = (snapshot && snapshot.val()) || {};

        const userRole =
          (userObject &&
            Object.entries(userObject) &&
            Object.entries(userObject).length &&
            Object.entries(userObject).map((item) => {
              item[1].key = item[0];
              return item[1]['role'];
            })) ||
          [];

        const userStore =
          (userObject &&
            Object.entries(userObject) &&
            Object.entries(userObject).length &&
            Object.entries(userObject).map((item) => {
              item[1].key = item[0];
              return item[1]['store_id'];
            })) ||
          [];

        const userCate =
          (userObject &&
            Object.entries(userObject) &&
            Object.entries(userObject).length &&
            Object.entries(userObject).map((item) => {
              item[1].key = item[0];
              return item[1]['product_category'];
            })) ||
          [];
        

        setUserInfoRole(userRole);
        setUserInfoStore(userStore);
        setUserInfoCate(userCate);
      });

      
    });
  };

  useEffect(() => {
    if (loggedUser) history.push("/orders/processing");
  }, [loggedUser]);

  useEffect(() => {
    initAuth();
  }, []);

  const postLogin = ({ email, password }) => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        history.push("/orders/processing");
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
    userInfoRole,
    userInfoStore,
    userInfoCate,
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
