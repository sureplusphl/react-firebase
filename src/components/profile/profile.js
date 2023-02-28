import React from "react";
import ProfileForm from "./profile-form";
import { Layout, Row, Col } from "antd";

const { Content } = Layout;

const Profile = () => {
  return (
    <Layout className="layout">
      <Content
        style={{
          padding: "0 50px",
          margin: "100px auto",
          width: "100%",
        }}
      >
        <Row gutter={[8, 8]} width="100%" align="center">
          <Col md={12} sm={24}>
            <ProfileForm />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Profile;
