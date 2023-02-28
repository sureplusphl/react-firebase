import React from "react";
import { hydrate, render } from "react-dom";
import "./index.css";
import App from "./app";
import * as serviceWorker from "./serviceWorker";

import AppProvider from "./shared/contexts/app.context";
import { BrowserRouter as Router } from "react-router-dom";
import FirebaseProvider from "./shared/contexts/firebase.context";
import AuthProvider from "./shared/contexts/auth.context";

const rootElement = document.getElementById("root");

if (rootElement.hasChildNodes()) {
  hydrate(
    <Router>
      <FirebaseProvider>
        <AuthProvider>
          <AppProvider>
            <App />
          </AppProvider>
        </AuthProvider>
      </FirebaseProvider>
    </Router>,
    rootElement
  );
} else {
  render(
    <Router>
      <FirebaseProvider>
        <AuthProvider>
          <AppProvider>
            <App />
          </AppProvider>
        </AuthProvider>
      </FirebaseProvider>
    </Router>,
    rootElement
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
