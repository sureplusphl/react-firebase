import "firebaseui/dist/firebaseui.css";
import React, { createContext } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";
import firebaseConfig from "../configs/firebase";
require("firebaseui");
firebase.initializeApp(firebaseConfig);

export const FirebaseContext = createContext();

const FirebaseProvider = ({ children }) => {
  const auth = firebase.auth();
  const database = firebase.database();
  const storage = firebase.storage();
  const payload = { database, auth, storage };
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
