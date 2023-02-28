import "firebaseui/dist/firebaseui.css";
import React, { createContext } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import "firebase/database";
import firebaseConfig from "../configs/firebase";
const firebaseui = require("firebaseui");
firebase.initializeApp(firebaseConfig);

export const FirebaseContext = createContext();

const FirebaseProvider = ({ children }) => {
  const authUI = new firebaseui.auth.AuthUI(firebase.auth());
  const auth = firebase.auth();
  const database = firebase.database();

  const payload = { database, auth, firebase, authUI };
  return (
    <FirebaseContext.Provider value={payload}>
      {children}
    </FirebaseContext.Provider>
  );
};

FirebaseProvider.defaultProps = {};

FirebaseProvider.propTypes = {
  children: PropTypes.object.isRequired,
};

export default FirebaseProvider;
