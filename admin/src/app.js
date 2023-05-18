import React, { useState } from "react";
import { Layout, Button } from "antd";
import "antd/dist/antd.css";
import Sidebar from "./components/sidebar/sidebar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AuthProvider from "./shared/contexts/auth.context";
import FirebaseProvider from "./shared/contexts/firebase.context";
import Routing from "./components/routing";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;
function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <FirebaseProvider>
        <AuthProvider>
          <Layout hasSider>
            <Sider
              trigger={null}
              collapsible
              collapsed={collapsed}
              breakpoint="md"
              collapsedWidth="0"
              style={{
                overflow: "auto",
                height: "100vh",
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
                backgroundColor: "#ffffff",
              }}
            >
              <Sidebar />
            </Sider>
            <Layout
              className="site-layout"
              style={{
                marginLeft: collapsed ? 0 : 200,
              }}
            >
              <Header className="header">
                <Button
                  type="text"
                  icon={
                    collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                  }
                  onClick={() => setCollapsed(!collapsed)}
                  style={{
                    fontSize: "16px",
                    width: 64,
                    height: 64,
                  }}
                />
                {/* <div className="logo">
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/buyanihanph.appspot.com/o/announcements%2FSureplus%20Logo%20clear.png?alt=media&token=c369ffa5-f6b9-4d28-a88e-e55b56b31b5d"
                    alt=""
                    width="45px"
                    height="50px"
                    style={{ marginTop: "-7px" }}
                  />
                </div> */}
              </Header>
              <Content style={{ margin: "24px 16px 0" }}>
                <Layout
                  className="site-layout-background"
                  style={{ padding: "24px 0" }}
                >
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
          </Layout>
        </AuthProvider>
      </FirebaseProvider>
    </Router>
  );
}

export default App;
