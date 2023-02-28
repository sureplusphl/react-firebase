import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Button, Checkbox, Form, Input, Icon, Layout } from "antd";
import { AuthContext } from "../../shared/contexts/auth.context";

const Login = () => {
  const { postLogin } = useContext(AuthContext);
  const [form] = Form.useForm();
  const onFinish = () => {
    form.validateFields().then((data) => {
        postLogin(data);
    });
  };

  return (
    <Form form={form} name="login" layout="inline" onFinish={onFinish}>
      <Form.Item
        name="email"
        rules={[{ required: true, message: "Please input your email!" }]}
      >
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input type="password" placeholder="Password" />
      </Form.Item>
      <Form.Item shouldUpdate={true}>
        {() => (
          <Button
            type="primary"
            htmlType="submit"
            disabled={
              !form.isFieldsTouched(true) ||
              form.getFieldsError().filter(({ errors }) => errors.length).length
            }
          >
            Log in
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default Login;
