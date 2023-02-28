import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Form, Input, Layout, Col, Row } from "antd";
import { AuthContext } from "../shared/contexts/auth.context";

const SignUpPage = () => {
  const { Content } = Layout;
  const { postLogin, firebase, authUI } = useContext(AuthContext);
  const [form] = Form.useForm();

  useEffect(() => {
    authUI.start("#firebaseui-auth-container", {
      callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          return true;
        },
        uiShown: function () {
          // The widget is rendered.
          // Hide the loader.
          document.getElementById("loader").style.display = "none";
        },
      },
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      signInFlow: "popup",
      signInSuccessUrl: `${process.env.PUBLIC_URL}/profile/`,
      // Terms of service url.
      tosUrl: "/",
      // Privacy policy url.
      privacyPolicyUrl: "/",
      signInOptions: [
        // {
        //   provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        //   scopes: ["https://www.googleapis.com/auth/contacts.readonly"],
        //   customParameters: {
        //     // Forces account selection even when one account
        //     // is available.
        //     prompt: "select_account",
        //   },
        // },
        {
          provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          scopes: ["public_profile", "email"],
          customParameters: {
            // Forces password re-entry.
            // auth_type: "reauthenticate",
          },
        },
        firebase.auth.EmailAuthProvider.PROVIDER_ID, // Other providers don't need to be given as object.
      ],
    });
  }, []);

  return (
    <Content
      style={{
        margin: "100px auto",
        height: "calc(100vh - 340px)",
        width: "100%",
      }}
    >
      <Row align="center">
        <Col md={16} sm={24}>
          <div id="firebaseui-auth-container"></div>
          <div id="loader">Loading...</div>
        </Col>
      </Row>
    </Content>
  );
};

export default SignUpPage;
