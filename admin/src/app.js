import React from "react";
import { Layout } from "antd";
import "antd/dist/antd.css";
import Sidebar from "./components/sidebar/sidebar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AuthProvider from "./shared/contexts/auth.context";
import FirebaseProvider from "./shared/contexts/firebase.context";
import Routing from "./components/routing";

const { Header, Content, Footer } = Layout;
function App() {
  return (
    <Router>
      <FirebaseProvider>
        <AuthProvider>
          <Layout>
            <Header className="header">
              <div className="logo">
                <img
                src="https://firebasestorage.googleapis.com/v0/b/buyanihanph.appspot.com/o/announcements%2FSureplus%20Logo%20clear.png?alt=media&token=c369ffa5-f6b9-4d28-a88e-e55b56b31b5d"
                alt=""
                width="45px"
                height="50px" 
                style={{marginTop:'-7px'}}
                />
              </div>
            </Header>
            <Content style={{ padding: "0 50px" }}>
              <Layout
                className="site-layout-background"
                style={{ padding: "24px 0" }}
              >
                <Sidebar />
                <Content
                  className="site-layout-background"
                  style={{ padding: "24px", minHeight: 280 }}
                >
                  <Routing />
                </Content>
              </Layout>
            </Content>
            <Footer style={{ textAlign: "center" }}>
              SurePlus Administration ©2020
            </Footer>
          </Layout>
        </AuthProvider>
      </FirebaseProvider>
    </Router>
  );
}

export default App;
