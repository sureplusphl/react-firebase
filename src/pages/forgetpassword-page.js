import React, { useContext, useEffect } from "react";
import { Button, Form, Input, Layout, Col, Row, Typography } from "antd";
import { AuthContext } from "../shared/contexts/auth.context";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import "./login.css";

const { Title, Text } = Typography;

const ForgetPage = () => {
  const { Content } = Layout;
  const { postLogin, firebase, authUI } = useContext(AuthContext);
  const [form] = Form.useForm();

  const onFinish = (data) => {
    const email = data.email;


    firebase.auth().sendPasswordResetEmail(email)
      .then(function (user) {
        Swal.fire({
          icon: "success",
          title: "Information Sent",
          text:
            "Kindly Check your Email",
        });
      }).catch(function (e) {
        // console.log(e)
        Swal.fire({
          icon: "warning",
          title: "Email Error",
          text:
            e,
        });
      })
  };

  return (
    <Content
      style={{
        margin: "100px auto",
        height: "calc(100vh - 250px)",
        width: "100%",
      }}
    >


      <Row align="center">
        <Col xl={8} md={12} xs={24}>

          <Title level={4} style={{textAlign:'center'}}>
            Please provide your Email Address below and we will send 
            information on how to recover your account
          </Title>

          <Form
            name="normal_login"
            className="login-form reg-FormContainer"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="email"
              />
            </Form.Item>
            

            <Form.Item className="ant-form-item-control-input-content">
              <Button
                type="primary"
                htmlType="submit"
                className="loginButton login-form-button"
                disabled={
                  !form.isFieldsTouched(true) ||
                  form.getFieldsError().filter(({ errors }) => errors.length).length
                }
              >
                Reset Password
              </Button>
            </Form.Item>

          </Form>

        </Col>
      </Row>
    </Content>
  );
};

export default ForgetPage;
