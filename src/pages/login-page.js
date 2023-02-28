import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Form, Input, Layout, Col, Row } from "antd";
import { AuthContext } from "../shared/contexts/auth.context";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./login.css";


const LoginPage = () => {
  const { Content } = Layout;
  const { postLogin, firebase, authUI } = useContext(AuthContext);
  const [form] = Form.useForm();

  const onFinish = (data) => {
    console.log("values");
    console.log(data);
    form.validateFields().then((data) => {
      postLogin(data);
    });
  };

  return (
    <Content
      style={{
        margin: "100px auto",
        height: "calc(100vh - 335px)",
        width: "100%",
      }}
    >
      {/* <Row align="center" className="">
        <Col md={4} xs={12}>
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/davao market logo.jpg`}
            alt=""
            width="100%"
            height="100%"
            style={{margin:'0 auto', display:'block'}} />
        </Col>
      </Row> */}
      

      <Row align="center">
        <Col xl={8} md={12} xs={24}>
          <Form
            form={form}
            name="login"
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
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item className="ant-form-item-control-input-content">
              <Button
                type="primary"
                htmlType="submit"
                className="loginButton login-form-button"
                // disabled={
                //   !form.isFieldsTouched(true) ||
                //   form.getFieldsError().filter(({ errors }) => errors.length).length
                // }
              >
                Log in
              </Button>
            </Form.Item>

          </Form>

          <p style={{textAlign:'center'}}>
            <Link to="/forgetpassword">
              Forget Password?
            </Link>
          </p>
        </Col>
      </Row>
    </Content>
  );
};

export default LoginPage;
